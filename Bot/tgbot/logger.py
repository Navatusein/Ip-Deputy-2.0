import logging
from logging import FileHandler

from os import path, makedirs

_log_formatter = logging.Formatter(fmt='%(asctime)s %(levelname)-.4s (%(filename)s).%(funcName)s(%(lineno)s) %('
                                       'message)s',
                                   datefmt='%d.%m.%Y %H:%M:%S')


def get_file_handler():
    if not path.exists('logs'):
        makedirs('logs')

    file_handler = FileHandler('logs/Log.log')
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(_log_formatter)
    return file_handler


def get_stream_handler():
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    stream_handler.setFormatter(_log_formatter)
    return stream_handler


def get_logger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    logger.addHandler(get_file_handler())
    logger.addHandler(get_stream_handler())
    return logger
