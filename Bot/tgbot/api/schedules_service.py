import requests as requests

from tgbot.logger import get_logger

from . import headers, base_url

logger = get_logger(__name__)


def get_schedule_for_day(telegram_id: int, date: str) -> dict:
    response = requests.get(f'{base_url}/schedules/day',
                            params={'telegramId': telegram_id, 'dateString': date},
                            headers=headers)
    return response.json()


def get_schedule_for_week(telegram_id: int, date: str) -> dict:
    response = requests.get(f'{base_url}/schedules/week',
                            params={'telegramId': telegram_id, 'dateString': date},
                            headers=headers)
    return response.json()
