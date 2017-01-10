import os

from flask import Blueprint, render_template, redirect, url_for

from utils.u_funcs import get_static, get_vendor_files

home = Blueprint('home', __name__, template_folder='templates')

js, css = get_static(['admin'])
vendor_js, vendor_css = get_vendor_files()

payload = {
    'title': 'ESD Codes',
    'js': js,
    'css': css,
    "vendor_js": vendor_js,
    "vendor_css": vendor_css
}


@home.route('/')
def index():
    payload.update({
        'tag': "Welcome",
        'tagline': "to something fun"
    })
    return render_template('page/index.html', **payload)


@home.route('/tutorial')
def tutorial():
    payload.update({
        'tag': "Tutorial",
        'tagline': "Pick me up."
    })
    return render_template('page/tutorial.html', **payload)


@home.route('/problems/')
@home.route('/problems/<path>')
@home.route('/problems/<path:path>')
def problems(path=""):
    payload.update({
        'tag': "Problems",
        "tagline": "I'm owning this."
    })

    if not path.replace('/', '').isnumeric() and len(path) > 0:
        return redirect(url_for('.problems'))
    return render_template("page/problems.html", **payload)
