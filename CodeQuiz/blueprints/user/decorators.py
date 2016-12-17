from functools import wraps

from flask import flash, redirect, url_for
from flask_login import current_user


def anonymous_required(url='/settings'):
    """
    Redirect a user to a specified location if they are already signed in.
    :param url: URL to be redirected to if invalid
    :return: Function
    """

    def decorator(f):
        @wraps(f)
        def decorated_func(*args, **kwargs):
            if current_user.is_authenticated:
                return redirect(url)
            return f(*args, **kwargs)

        return decorated_func

    return decorator


def role_required(*roles):
    """
    Checks if user has permission to view the page
    :param *roles: 1 or more allowed roles
    :return: Function
    """

    def decorator(f):
        @wraps(f)
        def decorated_func(*args, **kwargs):
            if current_user.role not in roles:
                flash('You do not have permission to do that.', 'error')
                return redirect(url_for('home.index'))

            return f(*args, **kwargs)

        return decorated_func

    return decorator
