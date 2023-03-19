from aiogram import types, Dispatcher
from aiogram.dispatcher import FSMContext

from tgbot.logger import get_logger
from tgbot.api.authorization_service import login
from tgbot.keyboards.reply import main_menu, login_menu
from tgbot.middlewares.localization import i18n
from tgbot.misc.states import StateLogin

_ = i18n.lazy_gettext

logger = get_logger(__name__)


async def authorization(message: types.Message, state: FSMContext):
    try:
        telegram_id = message.from_user.id
        phone = message.contact['phone_number']

        if message.contact['user_id'] != telegram_id:
            await message.answer(_('Це не ваш контакт!'))
            logger.warning(f"id: {telegram_id} user: {message.from_user.username} sent the wrong contact")
            return

        user_auth_dto = {
            'TelegramId': telegram_id,
            'TelegramPhone': str(int(phone))
        }

        response = login(user_auth_dto)

        if response == 'Successfully logined':
            await message.answer(_('Авторизація пройшла успішно!'), reply_markup=main_menu)
            logger.info(f"id: {telegram_id} phone: {phone} user: {message.from_user.username} registered")

            await state.finish()
        elif response == 'No such student':
            await message.answer(_('Вас немає у базі даних!'))
            logger.info(f"fail login id: {telegram_id} phone: {phone} user: {message.from_user.username}")
            return
        else:
            await message.answer(_('Непередбачена помилка'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


async def authorization_without_contact(message: types.Message):
    try:
        await message.answer(_('Натисніть кнопку авторизуватися!'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


async def not_authorized(message: types.Message):
    try:
        await message.reply(text=_('Необхідно авторизуватися!'), reply_markup=login_menu)
        await StateLogin.Login.set()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


def register_login_menu(dp: Dispatcher):
    dp.register_message_handler(authorization, content_types=['contact'], state=StateLogin.Login)
    dp.register_message_handler(authorization_without_contact, state=StateLogin.Login)
    dp.register_message_handler(not_authorized, is_logined=False)
