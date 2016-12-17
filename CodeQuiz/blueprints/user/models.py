from collections import OrderedDict
from datetime import datetime
from pytz import utc

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from CodeQuiz.extensions import db
from utils.u_sqlalchemy import ResourceMixin, AwareDateTime


class User(UserMixin, ResourceMixin, db.Model):
    ROLE = OrderedDict([
        ('admin', 'Admin'),
        ('member', 'Member')
    ])

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)

    # Authentication
    role = db.Column(db.Enum(*ROLE, name='role_types', native_enum=False), index=True, nullable=False,
                     server_default='member')
    active = db.Column('is_active', db.Boolean(), nullable=False, server_default='1')
    username = db.Column(db.String(30), unique=True, index=True)
    email = db.Column(db.String(256), index=True, unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False, server_default='')

    # Personal Info
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    # Activity Tracking
    sign_in_count = db.Column(db.Integer, nullable=False, default=0)
    current_sign_in_ip = db.Column(db.String(45))
    last_sign_in_ip = db.Column(db.String(45))
    current_sign_in_time = db.Column(AwareDateTime())
    last_sign_in_time = db.Column(AwareDateTime())

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.password = User.encrypt_password(kwargs.get('password', ''))

    @classmethod
    def find_by_identity(cls, identity: str):
        """
        Find a user by their email or username
        :param identity: email or username
        :return: User Instnace
        """
        return User.query.filter(
            (User.email == identity) | (User.username == identity)) \
            .first()

    @classmethod
    def encrypt_password(cls, plain: str):
        """
        Takes a plain text and hashes it with werkzeug's security hash function
        :param plain: plain text string
        :return: hashed password if plaintext, else None
        """
        if plain:
            return generate_password_hash(plain)
        return None

    def authenticated(self, password='', with_password=True):
        """
        Ensure user is authenticated, optionally check their password
        :param password: password
        :param with_password: False if doing reset
        :return: bool
        """
        if with_password:
            return check_password_hash(self.password, password)
        return True

    def update_activity_tracking(self, ip_address):
        """
        Updates meta-data related to user
        :param ip_address: ip address of user
        :return: self
        """
        self.sign_in_count += 1

        self.last_sign_in_ip = self.current_sign_in_ip
        self.current_sign_in_ip = ip_address

        self.last_sign_in_time = self.current_sign_in_time
        self.current_sign_in_time = datetime.now(utc)

        self.save()
        return self

    def is_active(self):
        """
        Check if user is active.
        :return: bool, True if user is active; False otherwise
        """
        return self.active

    def deactivate(self):
        """
        Deactivate user. Could be because user doesn't want his account like Facebook deactivate. Or cause user
        is an asshole
        :return: self
        """
        self.active = False
        return self

    def activate(self):
        """
        Activate User. Make user account playable again
        :return: self
        """
        self.active = True
        return self
