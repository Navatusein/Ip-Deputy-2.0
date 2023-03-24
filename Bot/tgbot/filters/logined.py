import typing

from aiogram import types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher.filters import BoundFilter

from tgbot.api.authorization_service import is_authorized
from tgbot.logger import get_logger

logger = get_logger(__name__)


class LoginFilter(BoundFilter):
    key = 'is_logined'

    def __init__(self, is_logined: typing.Optional[bool] = None):
        self.is_logined = is_logined

    async def check(self, obj: types.Message):
        if self.is_logined is None:
            return False

        storage: MemoryStorage = obj.bot.get('storage')

        if 'logined_user_info' not in storage.data:
            storage.data['logined_user_info'] = {}
            logger.info("Storage created logined_user_info")

        if obj.from_user.id not in storage.data['logined_user_info']:
            is_user_authorized = is_authorized(obj.from_user.id)

            if not is_user_authorized:
                return is_user_authorized == self.is_logined

            storage.data['logined_user_info'][obj.from_user.id] = is_user_authorized
            logger.info(f"Storage added user: {obj.from_user.id} to logined_user_info")

        is_user_authorized = storage.data['logined_user_info'][obj.from_user.id]

        return is_user_authorized == self.is_logined
