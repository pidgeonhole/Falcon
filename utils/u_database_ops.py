import sys
from sqlalchemy_utils import database_exists, create_database

from CodeQuiz.blueprints.user.models import User
from CodeQuiz.app import create_app
from CodeQuiz.extensions import db

from config.settings import SQLALCHEMY_DATABASE_URI, ADMIN_PASSWORD


def initialize(app=None):
    if not database_exists(SQLALCHEMY_DATABASE_URI):
        print("DATABASE DOESN'T EXIST. SOMETHING IS WRONG! ", file=sys.stderr)
        if False:
            # Be very careful when running this line
            create_database(SQLALCHEMY_DATABASE_URI)
        return

    if app is None:
        app = create_app('local')
    db.app = app

    tables = [
        User.__table__,
    ]
    db.metadata.drop_all(db.engine, tables=tables)
    db.metadata.create_all(db.engine, tables=tables)
    seed()


def seed():
    """
    Put in some random user
    :return: None
    """
    params = {
        'role': 'admin',
        'email': 'daniel_bok@mymail.sutd.edu.sg',
        'username': 'Daniel',
        'password': ADMIN_PASSWORD,
        'first_name': 'Daniel',
        'last_name': 'Bok'
    }
    if User.find_by_identity(params['username']) or User.find_by_identity(params['email']):
        return None
    else:
        return User(**params).save()
