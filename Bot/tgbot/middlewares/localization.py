from typing import Tuple, Any

from aiogram import types, Dispatcher
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.contrib.middlewares.i18n import I18nMiddleware

from tgbot.api.students_service import get_language
from tgbot.logger import get_logger

logger = get_logger(__name__)


class Localization(I18nMiddleware):
    async def get_user_locale(self, action: str, args: Tuple[Any]) -> str:
        user_id = types.User.get_current().id

        storage: MemoryStorage = types.User.get_current().bot.get('storage')

        if 'language_user_info' not in storage.data:
            storage.data['language_user_info'] = {}
            logger.info("Storage created language_user_info")

        if user_id not in storage.data['language_user_info']:
            success, language = get_language(user_id)

            if not success:
                return 'uk'

            storage.data['language_user_info'][user_id] = language
            logger.info(f"Storage added user: {user_id} value: {language} to logined_user_info")

        return storage.data['language_user_info'][user_id]


i18n = Localization('locales', 'locales')
