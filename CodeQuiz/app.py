from flask import Flask

from CodeQuiz.blueprints.home import home
from CodeQuiz.blueprints.testAPI import testAPI
from CodeQuiz.extensions import extends


def create_app(location="local", settings_override=None):
    """
    Create the flask app with required settings
    :param settings_override: (dict) overrides settings file
    :return: Flask app
    """

    app = Flask(__name__, instance_relative_config=True)

    if location.lower() == "local":
        app.config.from_object('config.settings')
        app.config.from_pyfile('settings.py', silent=True)
    elif location.lower() in {'server', 'production'}:
        app.config.from_object('production.settings')
        app.config.from_pyfile('settings.py', silent=True)

    if settings_override:
        app.config.update(settings_override)

    # Register blueprints here
    app.register_blueprint(home)
    app.register_blueprint(testAPI, url_prefix="/test")

    # Extend app to use other 3rd-party flask libraries
    app = extends(app)
    return app
