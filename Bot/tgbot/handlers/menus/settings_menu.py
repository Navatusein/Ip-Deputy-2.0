from aiogram import types, Dispatcher
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup

from tgbot.api.students_service import set_language, set_schedule_format, get_schedule_format
from tgbot.keyboards.reply import language_list, settings_menu
from tgbot.logger import get_logger
from tgbot.middlewares.localization import i18n
from tgbot.misc.states import StateChangeLanguage, StateChangeScheduleFormat

_ = i18n.lazy_gettext

logger = get_logger(__name__)


# region Menu handlers
# region 🇺🇦 Мова
# 🇺🇦 Мова
async def menu_handler_language(message: types.Message):
    try:
        await message.answer(message.text, reply_markup=language_list)
        await StateChangeLanguage.SelectLanguage.set()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# StateChangeLanguage SelectLanguage
async def state_handler_select_language(message: types.Message, state: FSMContext):
    try:
        storage: MemoryStorage = message.bot.get('storage')

        languages = [
            {'key': 'uk', 'name': '🇺🇦 Українська'},
            {'key': 'ru', 'name': '🇷🇺 Русский'}
        ]

        language = [value for value in languages if value['name'] == message.text]

        if not len(language):
            await message.answer(_('Некоректне введення!'))
            return

        language = language[0]

        language_dto = {
            'TelegramId': message.from_user.id,
            'Language': language['key']
        }

        i18n.ctx_locale.set(language['key'])
        storage.data['language_user_info'][message.from_user.id] = language['key']

        set_language(language_dto)
        await message.answer(message.text, reply_markup=settings_menu)
        await state.finish()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))
# endregion


# region 🗓 Формат розкладу
# 🗓 Формат розкладу
async def menu_handler_schedule_format(message: types.Message):
    try:
        reply_keyboard = ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(_('↩ Назад'))]
            ],
            resize_keyboard=True
        )

        schedule_compact = get_schedule_format(message.from_user.id)

        if schedule_compact:
            button = KeyboardButton(_('🗄 Компактний: Увімк'))
        else:
            button = KeyboardButton(_('🗄 Компактний: Вимк'))

        reply_keyboard.keyboard.append([button])

        await message.answer(message.text, reply_markup=reply_keyboard)
        await StateChangeScheduleFormat.SelectScheduleFormat.set()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# StateChangeScheduleFormat SelectScheduleFormat
async def state_handler_select_schedule_format(message: types.Message, state: FSMContext):
    try:
        if message.text == _('🗄 Компактний: Увімк'):
            schedule_compact = False
        elif message.text == _('🗄 Компактний: Вимк'):
            schedule_compact = True
        else:
            await message.answer(_('Некоректне введення!'))
            return

        schedule_format_dto = {
            'TelegramId': message.from_user.id,
            'ScheduleCompact': schedule_compact
        }

        set_schedule_format(schedule_format_dto)
        await message.answer(message.text, reply_markup=settings_menu)
        await state.finish()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))
# endregion


# ↩ Назад
async def menu_handler_back(message: types.Message, state: FSMContext):
    await message.answer(message.text, reply_markup=settings_menu)
    await state.finish()


# endregion

def register_settings_menu(dp: Dispatcher):
    dp.register_message_handler(menu_handler_back, text=_('↩ Назад'), state=[
        StateChangeLanguage.SelectLanguage,
        StateChangeScheduleFormat.SelectScheduleFormat
    ])

    dp.register_message_handler(menu_handler_language, text=_('🇺🇦 Мова'), is_logined=True)
    dp.register_message_handler(state_handler_select_language, state=StateChangeLanguage.SelectLanguage)

    dp.register_message_handler(menu_handler_schedule_format, text=_('🗓 Формат розкладу'), is_logined=True)
    dp.register_message_handler(state_handler_select_schedule_format,
                                state=StateChangeScheduleFormat.SelectScheduleFormat)
