from flask import Blueprint, render_template
from flask_login import login_required, current_user

from CodeQuiz.blueprints.user.decorators import role_required

admin = Blueprint('admin', __name__, template_folder='templates')

payload = {
    "title": "Admin"
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
        "title"  : "Admin Dashboard",
        "tagline": "Let's see everything"
    })
    return render_template("page/dashboard.html", **payload)


@admin.route('/questions/new')
def add_questions():
    payload.update({
        'title'  : "Making your questions",
        'tagline': 'has never been easier..'
    })
    return render_template("page/add_questions.html", **payload)


@admin.route('/questions')
@admin.route('/questions/edit')
def edit_questions():
    payload.update({
        'title'  : 'Editing questions',
        'tagline': 'piece of cake..'
    })
    return "Under Construction"
