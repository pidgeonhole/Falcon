from flask import Flask

# Blueprints
from CodeQuiz.blueprints.admin import admin
from CodeQuiz.blueprints.documentation import docs
from CodeQuiz.blueprints.home import home
from CodeQuiz.blueprints.user import user

# Extensions and mutations
from CodeQuiz.extensions import login_manager, db
from CodeQuiz.blueprints.user.models import User


def create_app(location, settings_override=None):
    """
    Create the flask app with required settings
    :param location: whether running in 'local' or 'server' mode
    :param settings_override: (dict) overrides settings file
    :return: Flask app
    """

    app = Flask(__name__, instance_relative_config=True, static_folder="./static")
    print(app.config.get('STATIC_ROOT', ''))

    if location.lower() == "local":
        app.config.from_object('config.settings')
        app.config.from_pyfile('settings.py', silent=True)
    elif location.lower() in {'server', 'production'}:
        app.config.from_object('production.settings')
        app.config.from_pyfile('settings.py', silent=True)
    else:
        raise ValueError("location argument not recognized")

    if settings_override:
        app.config.update(settings_override)

    # Register blueprints here
    app.register_blueprint(user)
    app.register_blueprint(home)
    # app.register_blueprint(coding_challenges)  # todo
    app.register_blueprint(admin, url_prefix="/admin")
    app.register_blueprint(docs, url_prefix="/docs")

    # Extend app to use other 3rd-party flask libraries
    app = extends(app)
    authentication(app, User)  # For Flask-login
    return app


def extends(app):
    """
    Extends the flask app with our library's functionalities
    :param app: app instance
    :return: extended app instance
    """
    login_manager.init_app(app)
    db.init_app(app)
    return app


def authentication(app, user_model: User):
    """
    Initialize Flask-Login extension (mutates the app instance passed in). Methods imposed are required "overwrites"
     over the base Flask-Login abstract methods
    :param app: app instance
    :param user_model: SQL User model
    :return: app instance
    """

    login_manager.login_view = 'user.login'  # the login page

    @login_manager.user_loader
    def load_user(uid):
        return user_model.query.get(uid)

    return app
