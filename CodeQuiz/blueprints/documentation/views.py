from flask import Blueprint, render_template

docs = Blueprint('docs', __name__, template_folder='templates')


@docs.route('/')
def index():
    return render_template("index.html")


@docs.route('/rookery')
def questions():
    return render_template("page/rookery.html")
