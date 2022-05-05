import jwt
import uuid
import secrets
import os

"""
	Return a JWT generated with a unique key for each user.
	Each key is stored in its own file on the jwt_keys folder.
"""
def generate(ip, data):

	key_name = str(uuid.uuid4()) + ".key"
	key_path = f"jwt_keys/{key_name}"

	user_secret = f"{ip}|{secrets.token_urlsafe(128)}"
	open(key_path, 'w').write(user_secret)

	return jwt.encode(data, user_secret, algorithm="HS512", headers={"kid": key_name})

"""
	Check if JWT is valid, signed and returns decoded jwt.
"""
def check(encoded_jwt):
	jwt_header = jwt.get_unverified_header(encoded_jwt)

	if ("kid" not in jwt_header):
		raise NameError('Missing kid in JWT header.')

	key_path = f"jwt_keys/{jwt_header['kid']}"

	if (not os.path.exists(key_path)):
		raise NameError('Key file not found.')

	if (os.path.getsize(key_path) == 0):
		raise NameError('Key file is empty.')

	with open(key_path, 'r') as file:
		user_secret = file.read()

	return jwt.decode(encoded_jwt, user_secret, algorithms="HS512")


def get_kid(encoded_jwt):
	return jwt.get_unverified_header(encoded_jwt)["kid"]