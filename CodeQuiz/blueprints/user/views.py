from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_required, login_user, current_user, logout_user

from .decorators import anonymous_required
from .forms import LoginForm, SignupForm
from .models import User
from utils.u_funcs import get_static, safe_url

user = Blueprint('user', __name__, template_folder='templates')

# Helper variables
get, post, both = ["GET"], ["POST"], ['GET', 'POST']
js, css = get_static(['apps', 'components', 'common'], folders=('vue-past', 'css'))

payload = {
    'js' : js,
    'css': css,
}


@user.route('/login', methods=both)
@anonymous_required()
def login():
    form = LoginForm(next_page=request.args.get('next'))

    if form.validate_on_submit():
        u = User.find_by_identity(request.form.get('identity'))
        if u and u.authenticated(request.form.get('password')):
            if login_user(u, remember=True) and u.is_active():
                u.update_activity_tracking(request.remote_addr)
                next_url = request.form.get('next')
                if next_url:
                    redirect(safe_url(next_url))
                return redirect(url_for('home.index'))
            else:
                message = "User: '{user}' has been disabled".format(user=u.username)
                flash(message, 'error')
        else:
            message = 'Identity or password is incorrect'
            flash(message, 'error')

    payload.update({
        'title'  : 'Login',
        'tagline': 'Go in~ Have fun~',
        'form'   : form
    })
    return render_template('user/login.html', **payload)


@user.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('user.login'))


@user.route('/signup', methods=both)
@anonymous_required()
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        u = User()
        form.populate_obj(u)
        u.password = User.encrypt_password(request.form.get('password'))
        u.save()

        if login_user(u):
            flash('Thanks for signing up!', 'success')
            return redirect(url_for('home.index'))

    payload.update({
        'title'  : 'Sign up',
        'tagline': 'Start of your wonderful journey',
        'form'   : form
    })

    return render_template('user/signup.html', **payload)
