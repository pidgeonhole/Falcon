from flask import Blueprint, jsonify, render_template
from CodeQuiz.commonData import MATERIAL_ICON_LISTS
from random import randrange

from config import settings

home = Blueprint('home', __name__, template_folder='templates')

payload = {
    'js' : '/static/bundle.main.js',
    'css': '/static/bundle.main.css'
}
if settings.DEBUG:
    payload['js'] = settings.WEBPACK_DEV_SERVER + '/bundle.main.js'
    payload['css'] = settings.WEBPACK_DEV_SERVER + '/bundle.main.css'


@home.route('/')
def index():
    payload.update(**{
        "title": "ESD Codes"
    })

    return render_template('page/index.html', **payload)


@home.route('/test_questions/')
def list_of_questions():
    n = len(MATERIAL_ICON_LISTS)
    numbers = randrange(n)
    questions = {
        "Dynamic Programming": ["Question 1", "Question 2"],
        "Path Problems": ["Djikstra's Algorithm", "Bellman Ford"]
    }
    return jsonify(questions)
