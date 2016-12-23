import cherrypy

from CodeQuiz.app import create_app

if __name__ == '__main__':
    app = create_app("server")
    print(app.config.get('SQLALCHEMY_DATABASE_URI'))
    # Mount the application
    cherrypy.tree.graft(app, "/")

    cherrypy.config.update({
        'server.socket_host'         : "0.0.0.0",
        'server.socket_port'         : 5000,
        'server.thread_pool'         : 30,
        # 'server.ssl_module'           : 'pyopenssl',
        # 'server.ssl_certificate'      : 'ssl/certificate.crt',
        # 'server.ssl_private_key'      : 'ssl/private.key',
        # 'server.ssl_certificate_chain': 'ssl/bundle.crt',
        'engine.autoreload.on'       : False,
        'engine.autoreload.frequency': 30,
        'request.scheme'             : 'http'
    })

    cherrypy.engine.start()
    cherrypy.engine.block()
