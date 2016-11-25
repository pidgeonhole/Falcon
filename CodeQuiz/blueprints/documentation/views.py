import os

from flask import Blueprint, redirect, render_template, url_for

docs = Blueprint('docs', __name__, template_folder='templates')


def get_template(name, version):
    folder = os.path.join(os.path.dirname(__file__), 'templates')
    if name not in os.listdir(folder):
        # folder does not exist, flash and redirect to index
        return redirect(url_for(".index"))

    versions = []
    for f in os.listdir(os.path.join(folder, name)):
        vnum = int(f.split('.')[0].split('v')[-1])
        versions.append((f, vnum))
    if version == "latest":
        return max(versions, key=lambda x: x[1])[0]

    version = int(version.split('v')[-1])
    for f, vnum in versions:
        if vnum == version:
            return f
    return max(versions, key=lambda x: x[1])[0]


@docs.route('/')
def index():
    return render_template("index.html")


@docs.route('/<name>')
@docs.route('/<name>/<version>')
def questions(name, version="latest"):
    template = name + '/' + get_template(name, version)
    return render_template(template)
