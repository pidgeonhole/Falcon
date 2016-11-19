from flask import Blueprint, render_template

admin = Blueprint('admin', __name__, template_folder='templates')


@admin.route('/')
def index():
    return render_template("page/dashboard.html")


@admin.route('/questions')
def questions():
    return render_template("page/questions.html")