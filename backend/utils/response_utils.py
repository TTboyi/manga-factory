from flask import jsonify

def success(data=None, message="ok",code=200):
    return jsonify({"code": code, "message": message, "data": data}), code

def error(message="error", code=400):
    return jsonify({"code": code, "message": message}), code
