from flask import Blueprint, render_template

from config import settings

home = Blueprint('home', __name__, template_folder='templates')

payload = {
    'js'   : '/static/bundle.main.js',
    'css'  : '/static/bundle.main.css',
    'title': 'ESD Codes'
}
if settings.DEBUG:
    payload['js'] = settings.WEBPACK_DEV_SERVER + '/bundle.main.js'
    payload['css'] = settings.WEBPACK_DEV_SERVER + '/bundle.main.css'


@home.route('/problems/', defaults={'path': ''})
@home.route('/problems/<path:path>')
def catchall(path):
    return render_template("page/index.html", **payload)


@home.route('/')
def index():
    return render_template('page/index.html', **payload)
