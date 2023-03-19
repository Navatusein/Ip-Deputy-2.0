from aiogram import types, Dispatcher
from aiogram.dispatcher import FSMContext
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton

from tgbot.keyboards.reply import submission_menu, submission_control, confirmation_menu
from tgbot.logger import get_logger
from tgbot.config import Config
from tgbot.api.authorization_service import get_frontend_token, is_admin
from tgbot.api.submissions_service import get_submissions_info, get_submission_students, clear_submission_students
from tgbot.middlewares.localization import i18n
from tgbot.misc.emoji import circles_emoji
from tgbot.misc.states import StateShowSubmissionList

_ = i18n.lazy_gettext

logger = get_logger(__name__)


# region Menu handlers
# ➕ Записатись
async def menu_handler_register_submission(message: types.Message):
    config: Config = message.bot.get('config')

    try:
        user_data = get_frontend_token(message.from_user.id)

        web_app = WebAppInfo(url=f'{config.FRONTEND_URL}/register-submission/{user_data}')

        inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(_('Відкрити інтерфейс'), web_app=web_app)]
        ], resize_keyboard=True)

        message_string = ''
        message_string += _("➕ Записатись") + '\n'
        message_string += _("Натисніть на кнопку щоб відкрити інтерфейс 👇")

        await message.answer(message_string, reply_markup=inline_keyboard)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🧾 Мої записи
async def menu_handler_control_submission(message: types.Message):
    config: Config = message.bot.get('config')

    try:
        user_data = get_frontend_token(message.from_user.id)

        web_app = WebAppInfo(url=f'{config.FRONTEND_URL}/control-submission/{user_data}')

        inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(_('Відкрити інтерфейс'), web_app=web_app)]
        ], resize_keyboard=True)

        message_string = ''
        message_string += _("🧾 Мої записи") + '\n'
        message_string += _("Натисніть на кнопку щоб відкрити інтерфейс 👇")

        await message.answer(message_string, reply_markup=inline_keyboard)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# region 🗳 Отримати список
# 🗳 Отримати список
async def menu_handler_get_submission(message: types.Message, state: FSMContext):
    try:
        submissions_infos = get_submissions_info(message.from_user.id)

        reply_keyboard = ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(_('↩ Назад'))]
            ],
            resize_keyboard=True
        )

        for index, value in enumerate(submissions_infos):
            button = KeyboardButton(f'{circles_emoji[index % 9]} {value["name"]}')
            reply_keyboard.keyboard.append([button])

        await message.answer('Вибери предмет 👇', reply_markup=reply_keyboard)

        await StateShowSubmissionList.SelectSubmissionInfo.set()

        async with state.proxy() as data:
            data['submissions_infos'] = submissions_infos

    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# StateShowSubmissionList SelectSubmissionInfo
async def state_handler_select_submission_info(message: types.Message, state: FSMContext):
    try:
        parsed_message = message.text[2:]

        async with state.proxy() as data:
            submissions_infos = data['submissions_infos']

        submissions_info = [value for value in submissions_infos if value['name'] == parsed_message]

        if not len(submissions_info):
            await message.answer(_('Некоректне введення!'))
            return

        submissions_info = submissions_info[0]

        async with state.proxy() as data:
            data['submissions_info'] = submissions_info

        submission_students = get_submission_students(submissions_info['id'])

        if not len(submission_students):
            await message.answer(_('На захист ніхто не записався'))
            return

        message_string = ''

        for index, submission_student in enumerate(submission_students):
            message_string += f'{index + 1}) {submission_student} ({submissions_info["type"].replace(".", "")}): '

            submission_count = len(submission_students[submission_student])

            for index2, submission in enumerate(submission_students[submission_student]):
                message_string += f'[{submission}]'

                if index2 < submission_count - 1:
                    message_string += ', '
                else:
                    message_string += ';'

            message_string += '\n'

        if is_admin(message.from_user.id):
            await message.answer(message_string, reply_markup=submission_control)
            await StateShowSubmissionList.SelectAction.set()
            return

        await message.answer(message_string, reply_markup=submission_menu)
        await state.finish()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# StateShowSubmissionList SelectAction
async def state_handler_select_action(message: types.Message):
    try:
        if message.text == _('❌ Очистити список'):
            await message.answer(_('Ви впевнені, що хочете очистити список?'), reply_markup=confirmation_menu)
            await StateShowSubmissionList.Confirmation.set()
        else:
            await message.answer(_('Некоректне введення!'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# StateShowSubmissionList Confirmation
async def state_handler_confirmation(message: types.Message, state: FSMContext):
    try:
        if message.text == _('❎ Скасувати'):
            await message.answer(_('Отмена.'), reply_markup=submission_menu)
            await state.finish()
            return
        elif message.text == _('✅ Підтвердити'):
            async with state.proxy() as data:
                submissions_info = data['submissions_info']

            clear_submission_students(submissions_info['id'])

            logger.info(f'{message.from_user.full_name} Cleared submission list: {submissions_info["name"]}')

            await state.finish()
            await message.answer(_('Список успішно очищений 👍'), reply_markup=submission_menu)
        else:
            await message.answer(_('Некоректне введення!'))
            return
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))
# endregion


# ↩ Назад
async def menu_handler_back(message: types.Message, state: FSMContext):
    await message.answer(message.text, reply_markup=submission_menu)
    await state.finish()


# endregion


def register_submission_menu(dp: Dispatcher):
    dp.register_message_handler(menu_handler_back, text=_('↩ Назад'), state=[
        StateShowSubmissionList.SelectSubmissionInfo,
        StateShowSubmissionList.SelectAction,
        StateShowSubmissionList.Confirmation
    ])

    dp.register_message_handler(menu_handler_register_submission, text=_('➕ Записатись'), is_logined=True)
    dp.register_message_handler(menu_handler_control_submission, text=_('🧾 Мої записи'), is_logined=True)

    dp.register_message_handler(menu_handler_get_submission, text=_('🗳 Отримати список'), is_logined=True)
    dp.register_message_handler(state_handler_select_submission_info,
                                state=StateShowSubmissionList.SelectSubmissionInfo)
    dp.register_message_handler(state_handler_select_action, state=StateShowSubmissionList.SelectAction)
    dp.register_message_handler(state_handler_confirmation, state=StateShowSubmissionList.Confirmation)
