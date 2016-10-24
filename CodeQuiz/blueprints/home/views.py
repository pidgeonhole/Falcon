from flask import Blueprint, render_template

home = Blueprint('home', __name__, template_folder='templates')


@home.route('/')
def index():
    payload = {
        "title": "ESD Codes"
    }
    return render_template('page/index.html', **payload)
