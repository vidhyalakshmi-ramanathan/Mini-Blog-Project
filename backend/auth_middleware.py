from functools import wraps
from flask import request, current_app
import jwt
import models

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']

            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
            else:
                return {
                    'message' : 'Token format is invalid',
                    'data' : None,
                    'error' : 'Unauthorized'
                },401
        if not token:
            return {
                'message' : 'Token is missing',
                'data' : None,
                'error' : 'Unauthorized'
            },401
        try:
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=['HS256'])
            current_user = models.User().getUserByUsername(data['username'])
            if current_user is None:
                return{
                    'message' : 'Invalid Authorization token',
                    'data' : None,
                    'error' : 'Unauthorized'
                },401
        except jwt.ExpiredSignatureError:
            return {
                'message' : 'Token expired'
            },401
        except jwt.InvalidTokenError:
            return {
                'message' : 'Invalid token'
            },401
        except Exception as e:
            return{
                'message' : 'Something went wrong',
                'data' : None,
                'error' : str(e)
            },500
        return f(currentUser=current_user, *args, **kwargs)
    return decorated

