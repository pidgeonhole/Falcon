from CodeQuiz.extensions import db
from datetime import datetime
from sqlalchemy import DateTime
from sqlalchemy.types import TypeDecorator
from .u_datetime import tzware_datetime



class AwareDateTime(TypeDecorator):
    impl = DateTime(timezone=True)

    def process_bind_param(self, value, dialect):
        if isinstance(value, datetime) and value.tzinfo is None:
            raise ValueError('{!r} must be TZ-aware'.format(value))
        return value

    def __repr__(self):
        return "AwareDateTime()"


class ResourceMixin(object):

    created_on = db.Column(AwareDateTime(), default=tzware_datetime)
    updated_on = db.Column(AwareDateTime(), default=tzware_datetime)

    def save(self):
        """
        Saves a model instance
        :return: Model Instance
        """
        db.session.add(self)
        db.session.commit()
        return self

    def delete(self):
        """
        Deletes a model instance
        :return: result of db.session.commit()
        """
        db.session.delete(self)
        return db.session.commit()

    def __str__(self):
        """
        Create a human readable version of the class instance
        :return: self
        """
        obj_id = hex(id(self))
        columns = self.__table__.c.keys()
        values = ', '.join("%s=%r" % (n, getattr(self, n)) for n in columns)
        return '<%s %s(%s)>' % (obj_id, self.__class__.__name__, values)
