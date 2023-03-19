from ..config import Config

config = Config()
headers = {'X-BOT-TOKEN': config.API_TOKEN}
base_url = config.API_URL
