from flask import Blueprint, render_template

admin = Blueprint('admin', __name__, template_folder='templates')

payload = {
    "title": "Admin"
}


@admin.route('/')
def index():
    payload.update({
        "title": "Admin Dashboard",
        "tagline": "Let's see everything"
    })
    return render_template("page/dashboard.html", **payload)


@admin.route('/questions')
def questions():
    payload.update({
        'title': "Making your questions",
        'tagline': 'has never been easier..'
    })
    return render_template("page/questions.html", **payload)