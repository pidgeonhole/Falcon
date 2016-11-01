import cherrypy

from CodeQuiz.app import create_app

if __name__ == '__main__':
    app = create_app("server")
    # Mount the application
    cherrypy.tree.graft(app, "/")

    # Mount Static Directories
    cherrypy.tree.mount(None, '/static', config={
        '/': {
            'tools.staticdir.on' : True,
            'tools.staticdir.dir': app.static_folder
        }
    })

    # Unsubscribe the default server
    cherrypy.server.unsubscribe()

    # Instantiate a new server object
    server = cherrypy._cpserver.Server()

    # Configure the server object
    server.socket_host = "0.0.0.0"
    server.socket_port = 5000
    server.thread_pool = 30

    # For SSL Support
    # server.ssl_module            = 'pyopenssl'
    # server.ssl_certificate       = 'ssl/certificate.crt'
    # server.ssl_private_key       = 'ssl/private.key'
    # server.ssl_certificate_chain = 'ssl/bundle.crt'

    # Subscribe this server
    server.subscribe()

    # Start the server engine (Option 1 *and* 2)
    cherrypy.engine.start()
    cherrypy.engine.block()