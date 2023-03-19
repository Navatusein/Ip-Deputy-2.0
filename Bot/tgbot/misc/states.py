from aiogram.dispatcher.filters.state import State, StatesGroup


class StateLogin(StatesGroup):
    Login = State()


class StateShowSubmissionList(StatesGroup):
    SelectSubmissionInfo = State()
    SelectAction = State()
    Confirmation = State()


class StateChangeLanguage(StatesGroup):
    SelectLanguage = State()


class StateChangeScheduleFormat(StatesGroup):
    SelectScheduleFormat = State()
