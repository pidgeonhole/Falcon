DEBUG = True
SECRET_KEY = "Don't Share This Key With Anyon3"
SQLALCHEMY_TRACK_MODIFICATIONS = False
db_uri = "postgresql://{username}:{password}@{addr}/{dbname}"

with open('config/SECRET.ENV') as f:
    addr, un, pw, dbname, ADMIN_PASSWORD = [_.strip() for _ in f.readlines()]

SQLALCHEMY_DATABASE_URI = db_uri.format(username=un, password=pw, addr=addr, dbname=dbname)
