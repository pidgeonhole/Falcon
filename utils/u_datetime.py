from datetime import datetime
import pytz


def tzware_datetime():
    """
    Return a timezone aware datetime instance
    :return: DateTime
    """
    return datetime.now(pytz.utc)
