from typing import Tuple, Any

from aiogram import types, Dispatcher
from aiogram.contrib.middlewares.i18n import I18nMiddleware

from tgbot.api.students_service import get_language


class Localization(I18nMiddleware):
    async def get_user_locale(self, action: str, args: Tuple[Any]) -> str:
        user_id = types.User.get_current().id

        success, language = get_language(user_id)

        if success:
            return language

        return 'uk'


i18n = Localization('locales', 'locales')
