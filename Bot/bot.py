import asyncio

from aiogram import Bot, Dispatcher
from aiogram.contrib.fsm_storage.memory import MemoryStorage

from tgbot.handlers.menus.settings_menu import register_settings_menu
from tgbot.logger import get_logger
from tgbot.config import Config
from tgbot.middlewares.localization import i18n
from tgbot.middlewares.last_activity import LastActivity
from tgbot.filters.admin import AdminFilter
from tgbot.filters.logined import LoginFilter
from tgbot.handlers.commands.start_command import register_start_command
from tgbot.handlers.menus.main_menu import register_main_menu
from tgbot.handlers.menus.schedule_menu import register_schedule_menu
from tgbot.handlers.menus.login_menu import register_login_menu
from tgbot.handlers.menus.submission_menu import register_submission_menu


logger = get_logger(__name__)


def register_all_middlewares(dp):
    dp.setup_middleware(i18n)
    dp.setup_middleware(LastActivity())


def register_all_filters(dp):
    dp.filters_factory.bind(AdminFilter)
    dp.filters_factory.bind(LoginFilter)


def register_all_handlers(dp):
    register_start_command(dp)
    register_main_menu(dp)
    register_schedule_menu(dp)
    register_submission_menu(dp)
    register_settings_menu(dp)
    register_login_menu(dp)


async def run_bot():
    config = Config()
    storage = MemoryStorage()
    bot = Bot(token=config.BOT_TOKEN, parse_mode='HTML')
    dp = Dispatcher(bot, storage=storage)

    register_all_middlewares(dp)
    register_all_filters(dp)
    register_all_handlers(dp)

    bot['config'] = config
    bot['storage'] = storage

    try:
        # loop = asyncio.get_event_loop()
        await dp.start_polling()
    finally:
        await dp.storage.close()
        await dp.storage.wait_closed()
        await bot.session.close()


def main():
    try:
        logger.info('Bot start')
        logger.info('Version: 1.0.2')
        asyncio.run(run_bot())
    except (KeyboardInterrupt, SystemExit, RuntimeError):
        logger.info('Bot stop')


if __name__ == '__main__':
    main()
