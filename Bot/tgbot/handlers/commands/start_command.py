import logging

from aiogram import types, Dispatcher
from aiogram.dispatcher import FSMContext


from tgbot.logger import get_logger
from tgbot.api.authorization_service import is_authorized
from tgbot.keyboards.reply import login_menu, main_menu
from tgbot.middlewares.localization import i18n
from tgbot.misc.states import StateLogin

_ = i18n.lazy_gettext

logger = get_logger(__name__)


async def command_Start(message: types.Message, state: FSMContext):
    try:
        telegram_id = message.from_user.id

        if not is_authorized(telegram_id):
            await message.reply(text=_('Потрібно авторизуватися!'), reply_markup=login_menu)
            await StateLogin.Login.set()
            return

        await message.answer(_('Авторизація пройшла успішно!'), reply_markup=main_menu)
        logger.info(f"id: {telegram_id} user: {message.from_user.username} logined")

        await state.finish()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


def register_start_command(dp: Dispatcher):
    dp.register_message_handler(command_Start, commands=['start'], state='*')
