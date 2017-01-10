from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user

from CodeQuiz.blueprints.user.decorators import role_required
from utils.u_funcs import get_static, get_vendor_files

admin = Blueprint('admin', __name__, template_folder='templates')

js, css = get_static()
vendor_js, vendor_css = get_vendor_files()

payload = {
    "title": "Admin",
    "js": js,
    "css": css,
    "vendor_js": vendor_js,
    "vendor_css": vendor_css
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
        "tag": "Admin Dashboard",
        "tagline": "Let's see everything"
    })
    return render_template("page/dashboard.html", **payload)


@admin.route('/questions/')
@admin.route('/questions/<path>')
@admin.route('/questions/<path>/edit')
@admin.route('/questions/<path:path>')
def questions(path=''):
    payload.update({
        'tag': 'Dealing with problems',
        'tagline': 'has never been easier'
    })

    print(path)

    path = path.replace('/', '')
    if len(path) > 0:
        if not (path in {'add'} or path.isnumeric()):
            return redirect(url_for('.questions'))

    return render_template('page/questions.html', **payload)