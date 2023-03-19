import requests as requests

from tgbot.logger import get_logger

from . import headers, base_url

logger = get_logger(__name__)


def get_submissions_info(telegram_id: int) -> list:
    response = requests.get(f'{base_url}/submissions/get-submissions-info',
                            params={'telegramId': telegram_id},
                            headers=headers)
    return response.json()


def get_submission_students(submission_id: int) -> list:
    response = requests.get(f'{base_url}/submissions/get-submission-students',
                            params={'submissionConfigId': submission_id},
                            headers=headers)
    return response.json()


def clear_submission_students(submission_id: int) -> bool:
    response = requests.delete(f'{base_url}/submissions/clear-submission-students',
                               params={'submissionConfigId': submission_id},
                               headers=headers)
    return response.status_code == 200
