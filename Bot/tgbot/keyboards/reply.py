from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

from tgbot.middlewares.localization import i18n

_ = i18n.lazy_gettext

# region utilities
confirmation_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('↩ Назад'))],
        [KeyboardButton(_('❎ Скасувати')), KeyboardButton(_('✅ Підтвердити'))]
    ],
    resize_keyboard=True
)
# endregion

# region login menu
login_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('🔐 Авторизуватися'), request_contact=True)]
    ],
    resize_keyboard=True
)
# endregion

# region main menu
main_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('🗓 Розклад')), KeyboardButton(_('🧾 Захист робіт'))],
        # [KeyboardButton(_('☎️ Зв\'язок')), KeyboardButton(_('🗒 Інформація'))],
        [KeyboardButton(_('🗒 Інформація'))],
        [KeyboardButton(_('🌐 Посилання'))],
        [KeyboardButton(_('⚙ Налаштування'))]
    ],
    resize_keyboard=True
)

main_menu_admin = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('🗓 Розклад')), KeyboardButton(_('🧾 Захист робіт'))],
        # [KeyboardButton(_('☎️ Зв\'язок')), KeyboardButton(_('🗒 Інформація'))],
        [KeyboardButton(_('🗒 Інформація'))],
        [KeyboardButton(_('🌐 Посилання'))],
        [KeyboardButton(_('⚙ Налаштування'))],
        [KeyboardButton(_('👑 Адмінка'))]
    ],
    resize_keyboard=True
)
# endregion

# region schedule menu
schedule_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('📋 Головне меню'))],
        [KeyboardButton(_('🕐 На сьогодні')), KeyboardButton(_('🕑 На завтра'))],
        [KeyboardButton(_('🕐 На цей тиждень')), KeyboardButton(_('🕑 На наступний тиждень'))],
        # [KeyboardButton(_('🗓 Весь розклад'))],
        # [KeyboardButton(_('👻 Розклад іншої групи'))]
    ],
    resize_keyboard=True
)
# endregion

# region submission menu
submission_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('📋 Головне меню'))],
        [KeyboardButton(_('➕ Записатись')), KeyboardButton(_('🧾 Мої записи'))],
        [KeyboardButton(_('🗳 Отримати список'))],
    ],
    resize_keyboard=True
)

submission_control = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('↩ Назад'))],
        [KeyboardButton(_('❌ Очистити список'))],
    ],
    resize_keyboard=True
)
# endregion

# region settings menu
settings_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('📋 Головне меню'))],
        [KeyboardButton(_('🇺🇦 Мова'))],
        [KeyboardButton(_('🗓 Формат розкладу'))],
    ],
    resize_keyboard=True
)

language_list = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('↩ Назад'))],
        [KeyboardButton('🇷🇺 Русский'), KeyboardButton('🇺🇦 Українська')]
    ],
    resize_keyboard=True
)
# endregion

# region admin menu
admin_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(_('↩ Назад'))]
    ],
    resize_keyboard=True
)
# endregion


