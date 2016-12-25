with open('config/SECRET.ENV') as f:
    _data = {}
    for _line in f.readlines():
        _key, _value = _line.strip().split("=")
        _data[_key] = _value

DEBUG = True
SECRET_KEY = "Don't Share This Key With Anyon3"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = _data['SQLALCHEMY_DATABASE_URI']
ADMIN_PASSWORD = _data['ADMIN_PASSWORD']
