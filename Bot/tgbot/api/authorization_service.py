import requests as requests

from tgbot.logger import get_logger

from . import headers, base_url

logger = get_logger(__name__)


def is_authorized(telegram_id: int) -> bool:
    response = requests.get(f'{base_url}/authentication/authorized',
                            params={'telegramId': telegram_id},
                            headers=headers)
    return response.status_code == 200


def is_admin(telegram_id: int) -> bool:
    response = requests.get(f'{base_url}/authentication/is-admin',
                            params={'telegramId': telegram_id},
                            headers=headers)

    if response.status_code != 200:
        logger.warning(f'{response.status_code} {response.text}')

    return response.json()


def login(user_auth_dto: dict) -> str:
    response = requests.post(f'{base_url}/authentication/login',
                             json=user_auth_dto,
                             headers=headers)

    return response.text.replace('\"', '').replace('\n', '')


def get_frontend_token(telegram_id: int) -> str:
    response = requests.get(f'{base_url}/authentication/frontend-token',
                            params={'telegramId': telegram_id},
                            headers=headers)
    return response.text
