from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user

from CodeQuiz.blueprints.user.decorators import role_required
from utils.u_funcs import get_static

admin = Blueprint('admin', __name__, template_folder='templates')

js, css = get_static(['common', 'admin'])

payload = {
    "title": "Admin",
    "js": js,
    "css": css
}


@admin.before_request
@login_required
@role_required('admin')
def before_request():
    """
    Checks that user is logged in as "Admin" for all endpoints in admin blueprint.
    Redirects to log in page if not logged in
    :return: None
    """
    # TODO: Add redirect to normal member's page if (not admin and logged in)
    pass


@admin.route('/')
def index():
    payload.update({
        "title": "Admin Dashboard",
        "tagline": "Let's see everything"
    })
    return render_template("page/dashboard.html", **payload)


@admin.route('/questions/')
@admin.route('/questions/<path>')
@admin.route('/questions/<path:path>')
def questions(path=''):
    payload.update({
        'title': 'Dealing with problems',
        'tagline': 'has never been easier'
    })

    if not path.replace('/', '').isnumeric() and len(path) > 0:
        return redirect(url_for('.questions'))

    return render_template('page/questions.html', **payload)
