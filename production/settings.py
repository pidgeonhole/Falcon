import os


def __get_secret(key):
    return os.environ.get(key)


DEBUG = False
SECRET_KEY = __get_secret("SECRET_KEY")
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = __get_secret("DATABASE")
