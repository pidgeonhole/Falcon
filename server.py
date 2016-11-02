import cherrypy

from CodeQuiz.app import create_app

if __name__ == '__main__':
    app = create_app("server")

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

    # Mount Static Directories
    cherrypy.tree.mount(None, '/static', config={
        '/static': {
            'tools.staticdir.on' : True,
            'tools.staticdir.dir': app.static_folder
        }
    })

    cherrypy.engine.start()
    cherrypy.engine.block()

    # Unsubscribe the default server
    # cherrypy.server.unsubscribe()

    # Instantiate a new server object
    # server = cherrypy._cpserver.Server()

    # Configure the server object
    # server.socket_host = "0.0.0.0"
    # server.socket_port = 5000
    # server.thread_pool = 30

    # For SSL Support
    # server.ssl_module            = 'pyopenssl'
    # server.ssl_certificate       = 'ssl/certificate.crt'
    # server.ssl_private_key       = 'ssl/private.key'
    # server.ssl_certificate_chain = 'ssl/bundle.crt'

    # Subscribe this server
    # server.subscribe()

    # Start the server engine (Option 1 *and* 2)
    # cherrypy.engine.start()
    # cherrypy.engine.block()
