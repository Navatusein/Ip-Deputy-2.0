from datetime import datetime, timedelta

from aiogram import types, Dispatcher
from aiogram.utils.markdown import hlink

from tgbot.api.students_service import get_schedule_format
from tgbot.logger import get_logger
from tgbot.api.schedules_service import get_schedule_for_day, get_schedule_for_week
from tgbot.middlewares.localization import i18n
from tgbot.misc.emoji import number_emoji

_ = i18n.lazy_gettext

logger = get_logger(__name__)


# Parse subject list to daily couples
def generate_day_couples(schedule: dict, subjects: list, show_time: bool = True) -> object:
    is_my_subgroup = True

    couple_string = ''

    for subject in subjects:
        subject_string = f'{number_emoji[subject["coupleIndex"] + 1]} '

        if show_time:
            subject_string += f'[{schedule["couplesTimes"][subject["coupleIndex"]]}] '

        if subject["link"] is not None:
            subject_string += hlink(subject["subject"], subject["link"])
        else:
            subject_string += subject["subject"]

        subject_string += f' ({subject["subjectType"]})'

        if not subject['isMySubgroup']:
            if is_my_subgroup:
                is_my_subgroup = False
                couple_string += f'\n🚷 <i>Пари у іншої підгрупи:</i>\n'

            couple_string += '<i>' + subject_string + '</i>\n'
        else:
            couple_string += subject_string + '\n'

    if len(subjects) == 0:
        couple_string += _('🛌 Пар немає, відпочивай!') + '\n'

    return couple_string


# Generate a daily schedule message
def generate_day_schedule_message(telegram_id: int, date: datetime):
    schedule = get_schedule_for_day(telegram_id, date.strftime('%Y-%m-%d'))

    message_string = ''

    if date.date() == datetime.today().date():
        message_string += _('<b>Розклад на сьогодні ({date}):</b>\n').format(date=date.strftime("%d.%m"))
    else:
        message_string += _('<b>Розклад на завтра ({date}):</b>\n').format(date=date.strftime("%d.%m"))

    message_string += generate_day_couples(schedule, schedule['subjects'])

    return message_string


# Generate a weekly schedule message
def generate_week_schedule_message(telegram_id: int, date: datetime, compact: bool = False):
    schedule = get_schedule_for_week(telegram_id, date.strftime('%Y-%m-%d'))

    days_of_week = [str(_('ПОНЕДІЛОК')), str(_('ВІВТОРОК')), str(_('СЕРЕДА')), str(_('ЧЕТВЕР')), str(_('П\'ЯТНИЦЯ')),
                    str(_('СУБОТА')), str(_('НЕДІЛЯ'))]

    message_string = ''

    if date.date() == datetime.today().date():
        message_string += _(f'<b>📅 Розклад на цей тиждень:</b>\n\n')
    else:
        message_string += _(f'<b>📅 Розклад на наступний тиждень:</b>\n\n')

    if compact:
        message_string += _(f'<b>Час пар:</b>\n')
        for index, value in enumerate(schedule["couplesTimes"]):
            message_string += f'{number_emoji[index + 1]} {value.replace(" ", "")}\n'

        message_string += '\n'

    for index, day_couples in enumerate(schedule['subjects']):
        message_string += f'<b>{days_of_week[index]} ({day_couples[:5]}):</b>\n'
        message_string += generate_day_couples(schedule, schedule['subjects'][day_couples], not compact)
        message_string += '\n'

    return message_string


# region Menu handlers
# 🕐 На сьогодні
async def menu_handler_today_schedule(message: types.Message):
    try:
        date = datetime.today()
        message_text = generate_day_schedule_message(message.from_user.id, date)

        await message.answer(message_text, disable_web_page_preview=True)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🕑 На завтра
async def menu_handler_tomorrow_schedule(message: types.Message):
    try:
        date = datetime.today() + timedelta(days=1)
        message_string = generate_day_schedule_message(message.from_user.id, date)

        await message.answer(message_string, disable_web_page_preview=True)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🕐 На цей тиждень
async def menu_handler_this_week_schedule(message: types.Message):
    try:
        schedule_compact = get_schedule_format(message.from_user.id)
        date = datetime.today()
        message_string = generate_week_schedule_message(message.from_user.id, date, schedule_compact)

        await message.answer(message_string, disable_web_page_preview=True)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🕑 На наступний тиждень
async def menu_handler_next_week_schedule(message: types.Message):
    try:
        schedule_compact = get_schedule_format(message.from_user.id)
        date = datetime.today() + timedelta(days=7 - datetime.today().weekday())
        message_string = generate_week_schedule_message(message.from_user.id, date, schedule_compact)

        await message.answer(message_string, disable_web_page_preview=True)
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 🗓 Весь розклад
async def menu_handler_full_schedule(message: types.Message):
    try:
        await message.answer(_('Бодя ледар ще не зробив 🤪'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))


# 👻 Розклад іншої групи
async def menu_handler_another_group_schedule(message: types.Message):
    try:
        await message.answer(_('Бодя ледар ще не зробив 🤪'))
    except Exception as e:
        logger.exception(e)
        await message.answer(_('Непередбачена помилка'))
# endregion


def register_schedule_menu(dp: Dispatcher):
    dp.register_message_handler(menu_handler_today_schedule, text=_('🕐 На сьогодні'), is_logined=True)
    dp.register_message_handler(menu_handler_tomorrow_schedule, text=_('🕑 На завтра'), is_logined=True)
    dp.register_message_handler(menu_handler_this_week_schedule, text=_('🕐 На цей тиждень'), is_logined=True)
    dp.register_message_handler(menu_handler_next_week_schedule, text=_('🕑 На наступний тиждень'), is_logined=True)
    dp.register_message_handler(menu_handler_full_schedule, text=_('🗓 Весь розклад'), is_logined=True)
    dp.register_message_handler(menu_handler_another_group_schedule, text=_('👻 Розклад іншої групи'), is_logined=True)
