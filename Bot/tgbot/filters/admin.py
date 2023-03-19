import typing

from aiogram.dispatcher.filters import BoundFilter

from tgbot.api.authorization_service import is_admin


class AdminFilter(BoundFilter):
    key = 'is_admin'

    def __init__(self, is_admin: typing.Optional[bool] = None):
        self.is_admin = is_admin

    async def check(self, obj):
        if self.is_admin is None:
            return False

        return is_admin(obj.from_user.id) == self.is_admin
