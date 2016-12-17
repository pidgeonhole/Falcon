from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, HiddenField
from wtforms.validators import DataRequired, Length, Email, EqualTo


class LoginForm(FlaskForm):
    next_page = HiddenField()
    identity = StringField('Username / Email', validators=[DataRequired(), Length(6, 256)])
    password = PasswordField('Password', validators=[DataRequired(), Length(8, 256)])


class SignupForm(FlaskForm):
    # Login Credentials
    username = StringField('Username', validators=[DataRequired(), Length(6, 256)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(8, 256)])
    confirm = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', 'Password must match')])

    # Personal Info
    first_name = StringField('First Name', validators=[DataRequired(), Length(1)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(1)])
