import os


class Config:
    BOT_TOKEN = os.environ.get('BOT_TOKEN')
    API_TOKEN = os.environ.get('API_TOKEN')
    API_URL = os.environ.get('API_URL')
    FRONTEND_URL = os.environ.get('FRONTEND_URL')
