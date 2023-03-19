from aiogram import types, Dispatcher

from tgbot.logger import get_logger
from tgbot.middlewares.localization import i18n

_ = i18n.lazy_gettext

logger = get_logger(__name__)


# region Menu handlers
# region 🇺🇦 Мова
async def menu_handler_language(message: types.Message):
    try:
        await message.answer(message.text)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))
# endregion

# endregion


def register_template_menu_menu(dp: Dispatcher):
    dp.register_message_handler(menu_handler_language, text=_('🇺🇦 Мова'), is_logined=True)
