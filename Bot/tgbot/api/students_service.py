from typing import Tuple

import requests as requests

from tgbot.logger import get_logger

from . import headers, base_url

logger = get_logger(__name__)


def update_last_activity(telegram_id: int) -> bool:
    response = requests.get(f'{base_url}/students/update-last-activity',
                            params={'telegramId': telegram_id},
                            headers=headers)
    return response.status_code == 200


def get_language(telegram_id: int) -> tuple[bool, str]:
    """

    :rtype: object
    """
    response = requests.get(f'{base_url}/students/language',
                            params={'telegramId': telegram_id},
                            headers=headers)
    return response.status_code == 200, response.text


def set_language(language_dto: dict) -> bool:
    response = requests.post(f'{base_url}/students/language',
                             json=language_dto,
                             headers=headers)
    return response.status_code == 200


def get_schedule_format(telegram_id: int) -> bool:
    response = requests.get(f'{base_url}/students/schedule',
                            params={'telegramId': telegram_id},
                            headers=headers)
    return response.json()


def set_schedule_format(schedule_format_dto: dict) -> bool:
    response = requests.post(f'{base_url}/students/schedule',
                             json=schedule_format_dto,
                             headers=headers)
    return response.status_code == 200
