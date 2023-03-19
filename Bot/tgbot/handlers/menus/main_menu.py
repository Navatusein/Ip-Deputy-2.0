from aiogram import types, Dispatcher
from aiogram.dispatcher import FSMContext

from tgbot.logger import get_logger
from tgbot.keyboards.reply import main_menu, main_menu_admin, admin_menu, schedule_menu, submission_menu, settings_menu
from tgbot.middlewares.localization import i18n

_ = i18n.lazy_gettext

logger = get_logger(__name__)


# region Menu handlers
# 📋 Головне меню
async def menu_handler_show_main_menu(message: types.Message, state: FSMContext):
    try:
        await message.answer(message.text, reply_markup=main_menu)
        await state.finish()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 📋 Головне меню
async def menu_handler_show_main_menu_admins(message: types.Message, state: FSMContext):
    try:
        await message.answer(message.text, reply_markup=main_menu_admin)
        await state.finish()
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🗓 Розклад
async def menu_handler_show_schedule_menu(message: types.Message):
    try:
        await message.answer(message.text, reply_markup=schedule_menu)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🧾 Захист робіт
async def menu_handler_show_submission_menu(message: types.Message):
    try:
        await message.answer(message.text, reply_markup=submission_menu)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# ☎️ Зв'язок
async def menu_handler_show_communication_menu(message: types.Message):
    try:
        await message.answer(_('Бодя ледар ще не зробив 🤪'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🗒 Інформація
async def menu_handler_show_information_menu(message: types.Message):
    try:
        await message.answer(_('Бодя ледар ще не зробив 🤪'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🌐 Посилання
async def menu_handler_show_links_menu(message: types.Message):
    try:
        await message.answer(_('Бодя ледар ще не зробив 🤪'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# ⚙ Налаштування
async def menu_handler_show_settings_menu(message: types.Message):
    try:
        await message.answer(message.text, reply_markup=settings_menu)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 👑 Адмінка
async def menu_handler_show_admin_menu(message: types.Message):
    try:
        await message.answer(message.text, reply_markup=admin_menu)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 👑 Адмінка
async def menu_handler_show_admin_menu_non_admin(message: types.Message):
    try:
        await message.answer(_('Недостатньо прав!'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))
# endregion


def register_main_menu(dp: Dispatcher):
    dp.register_message_handler(menu_handler_show_main_menu_admins, text=_('📋 Головне меню'), state='*', is_admin=True)
    dp.register_message_handler(menu_handler_show_main_menu, text=_('📋 Головне меню'), state='*', is_logined=True)

    dp.register_message_handler(menu_handler_show_main_menu_admins, text=_('↩ Назад'), is_admin=True)
    dp.register_message_handler(menu_handler_show_main_menu, text=_('↩ Назад'), is_logined=True)

    dp.register_message_handler(menu_handler_show_schedule_menu, text=_('🗓 Розклад'), is_logined=True)
    dp.register_message_handler(menu_handler_show_submission_menu, text=_('🧾 Захист робіт'), is_logined=True)
    dp.register_message_handler(menu_handler_show_communication_menu, text=_('☎️ Зв\'язок'), is_logined=True)
    dp.register_message_handler(menu_handler_show_information_menu, text=_('🗒 Інформація'), is_logined=True)
    dp.register_message_handler(menu_handler_show_links_menu, text=_('🌐 Посилання'), is_logined=True)
    dp.register_message_handler(menu_handler_show_settings_menu, text=_('⚙ Налаштування'), is_logined=True)

    dp.register_message_handler(menu_handler_show_admin_menu, text=_('👑 Адмінка'), is_admin=True)
    dp.register_message_handler(menu_handler_show_admin_menu_non_admin, text=_('👑 Адмінка'))
