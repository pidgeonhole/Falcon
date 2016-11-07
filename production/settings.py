def __get_secret(key):
    import os
    return os.environ[key]

DEBUG = False
SECRET_KEY = __get_secret("SECRET_KEY")

