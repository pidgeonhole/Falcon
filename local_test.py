import os

import cherrypy

from CodeQuiz.app import create_app

if __name__ == '__main__':
    os.environ["LOCAL"] = "1"
    app = create_app()

    # Mount the application
    cherrypy.tree.graft(app, "/")

    cherrypy.config.update({
        'server.socket_host'          : "0.0.0.0",
        'server.socket_port'          : 5000,
        'server.thread_pool'          : 30,
        # 'server.ssl_module'           : 'pyopenssl',
        # 'server.ssl_certificate'      : 'ssl/certificate.crt',
        # 'server.ssl_private_key'      : 'ssl/private.key',
        # 'server.ssl_certificate_chain': 'ssl/bundle.crt',
        'engine.autoreload.on'        : False,
        'engine.autoreload.frequency' : 30,
        'request.scheme'              : 'http'
    })

    cherrypy.tree.mount(None, '/static', config={
        '/static': {
            'tools.staticdir.on' : True,
            'tools.staticdir.dir': app.static_folder
        }
    })

    cherrypy.engine.start()
    cherrypy.engine.block()
