# -*- coding: utf-8 -*- 

import os, requests
from flask import Flask, jsonify, request, make_response, send_file, abort

from authz import jwt
from pdf import html2pdf

app = Flask(__name__)
app.config['APPLICATION_ROOT'] = '/api'

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error":"404 - Not found."}), 404

@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({"error":str(e)}), 500

@app.route('/auth')
def auth():
	role = "anon"
	if (request.remote_addr == os.environ["ADMIN_IP"]):
		role = "admin"
	
	jwt_enc = jwt.generate(request.remote_addr, {"acl":role})

	resp = make_response(jsonify({"jwt":jwt_enc}))
	resp.set_cookie('jwt', jwt_enc)

	return resp

@app.route("/me")
def me():
    if (request.cookies.get("jwt") is None):
	    raise NameError('Missing jwt cookie.')

    return jsonify(jwt.check(request.cookies.get("jwt")))

@app.route("/leaks")
def leaks():
    if (request.cookies.get("jwt") is None):
	    raise NameError('Missing jwt cookie.')

    jwt_dec = jwt.check(request.cookies.get("jwt"))
    if ("acl" not in jwt_dec or jwt_dec["acl"] != "admin"):
    	raise NameError('For admin only.')

    leak_domain = os.environ['LEAK_DOMAIN']
    leak_files = requests.get(f"http://{leak_domain}/latest-leaks.json").json()
    return jsonify({
    	leak_domain:leak_files
    })

@app.route('/document')
def document():

    if (request.cookies.get("jwt") is None):
        raise NameError('Missing jwt cookie.')

    jwt.check(request.cookies.get("jwt"))

    location = request.args.get("location")
    if (location is None):
        raise NameError("Missing location parameter.")

    if (not location.endswith(".disclosed")):
    	raise NameError("Only .disclosed extension allowed.")

    content = requests.get("http://files.internal" + location)
    if (content.status_code == 404):
        abort(404)

    if (request.args.get("raw") is not None):
        return content.text

    return send_file(
        html2pdf.generate_pdf(content, jwt.get_kid(request.cookies.get("jwt"))),
        mimetype='application/pdf'
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0")
