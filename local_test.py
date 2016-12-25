import argparse

import cherrypy

from CodeQuiz.app import create_app
from utils.u_database_ops import initialize


def get_parser():
    p = argparse.ArgumentParser("Localhost settings")
    p.add_argument('-s', '--seed', action='store_true', help="Seed database")
    return p


if __name__ == '__main__':

    parser = get_parser()
    args = parser.parse_args()

    app = create_app('local')

    # Run seeding ops
    if args.seed:
        print("%s: Initializing and seeding database" % __file__)
        initialize(app)
    print("%s: Running app in local environment. Development Mode." % __file__)
    app.run(host="0.0.0.0", port=5000)
    exit(0)
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
    # cherrypy.tree.mount(None, '/static', config={
    #     '/static': {
    #         'tools.staticdir.on' : True,
    #         'tools.staticdir.dir': app.static_folder
    #     }
    # })

    cherrypy.engine.start()
    cherrypy.engine.block()
