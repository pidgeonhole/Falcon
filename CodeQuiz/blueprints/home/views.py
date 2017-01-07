import os

from flask import Blueprint, render_template, redirect, url_for

from utils.u_funcs import get_static

home = Blueprint('home', __name__, template_folder='templates')

js, css = get_static(['common'])

payload = {
    'js': js,
    'css': css,
}


@home.route('/')
def index():
    payload.update({
        'title': "Welcome",
        'tagline': "to something fun"
    })
    return render_template('page/index.html', **payload)


@home.route('/tutorial')
def tutorial():
    payload.update({
        'title': "Tutorial",
        'tagline': "Pick me up."
    })
    return render_template('page/tutorial.html', **payload)


@home.route('/problems/')
@home.route('/problems/<name>')
def problems(name=""):
    payload.update({
        'title': "Problems",
        "tagline": "I'm owning this.",
        'name': name
    })

    return render_template("page/problems.html", **payload)
