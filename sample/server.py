import SimpleHTTPServer
import SocketServer

PORT = 8000

import os
os.chdir(os.path.dirname(__file__))
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
