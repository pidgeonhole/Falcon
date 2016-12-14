from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, login_user, current_user, logout_user

from CodeQuiz.blueprints.user.decorators import anonymous_required
from utils.u_funcs import get_static

user = Blueprint('user', __name__, template_folder='templates')

# Helper variables
get, post, both = ["GET"], ["POST"], ['GET', 'POST']
js, css = get_static(['apps', 'components', 'common'], folders=('vue', 'css'))

payload = {
    'js' : js,
    'css': css,
}


@user.route('/login', methods=both)
@anonymous_required()
def login():
    payload.update({
        'title'  : 'Login',
        'tagline': 'Go in~ Have fun~'
    })
    # if post, check and redirect. else display login

    return render_template('user/login.html', **payload)


@user.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('user.login'))
