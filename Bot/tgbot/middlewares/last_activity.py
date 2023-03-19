import logging
from datetime import datetime
from typing import Tuple, Any

from aiogram import types, Dispatcher
from aiogram.dispatcher.middlewares import BaseMiddleware

from tgbot.api.students_service import update_last_activity


class LastActivity(BaseMiddleware):
    def __int__(self):
        super(LastActivity, self).__init__()

    async def on_process_message(self, message: types.Message, data: dict):
        telegram_id = message.from_user.id

        update_last_activity(telegram_id)
