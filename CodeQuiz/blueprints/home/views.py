import os

from flask import Blueprint, render_template, redirect, url_for

from utils.funcs import get_static

home = Blueprint('home', __name__, template_folder='templates')

js, css = get_static(['widgets', 'hugefile', 'common'], dev=(os.environ.get("LOCAL") == '1'),
                     folders=('', 'vue', 'css'))

payload = {
    'js'   : js,
    'css'  : css,
    'title': 'ESD Codes'
}


# @home.route('/problems/', defaults={'path': ''})
# @home.route('/problems/<path:path>')
# def catchall(path):
#     return render_template("page/index.html", **payload)

@home.route('/')
def index():
    return render_template('page/index.html', **payload)


@home.route('/tutorial')
def tutorial():
    payload.update({
        'title': "Tutorial"
    })
    return render_template('page/tutorial.html', **payload)


@home.route('/problems/')
@home.route('/problems/<name>')
def problems(name=""):
    if not name:
        return redirect(url_for('.index'))
    payload.update({
        'title': "Problems",
        'name': name
    })

    return render_template("page/problems.html", **payload)