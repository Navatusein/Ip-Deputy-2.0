import typing

from aiogram.dispatcher.filters import BoundFilter

from tgbot.api.authorization_service import is_authorized


class LoginFilter(BoundFilter):
    key = 'is_logined'

    def __init__(self, is_logined: typing.Optional[bool] = None):
        self.is_logined = is_logined

    async def check(self, obj):
        if self.is_logined is None:
            return False

        return is_authorized(obj.from_user.id) == self.is_logined
