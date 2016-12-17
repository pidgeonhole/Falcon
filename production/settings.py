def __get_secret(key):
    import os, random
    return os.environ.get(key) or random.getrandbits(random.randint(120, 200))

DEBUG = False
SECRET_KEY = __get_secret("SECRET_KEY")
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = __get_secret('DATABASE')
