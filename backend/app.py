from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask_restx import Api, Resource,fields
from config import DevConfig
from models import User, Post
from exts import db
from auth_middleware import token_required
now = datetime.now()

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_object(DevConfig)

db.init_app(app)
api = Api(app,doc='/docs') 

#model (serializer)
User_model = api.model(
    "User",
    {
        "username":fields.String(),
        "password":fields.String()
    }
)

Post_model = api.model(
    "Post",
    {
        "title":fields.String(),
        "content":fields.String(),
        "category":fields.String()
    }
)

@api.route('/signup')
class Register(Resource):
    @api.expect(User_model)
    def post(self):
            try:
                data = request.json
                requiredFields = ['username', 'password','blogname']
                missing_fields = [field for field in requiredFields if not data.get(field) or not str(data.get(field)).strip()]
                if missing_fields:
                    return {
                        'message' : f'Please provide user details: {",".join(missing_fields)}',
                        "data" : None,
                        "error" : "Bad Request"
                    },400
                user = User().create(**data)
                if user == "username already exists":
                    return {
                        "message" : 'User Name already exists',
                        'error' : 'Conflict',
                        "data" : None
                    },409
                if user == "blogname already exists":
                    return{
                            "message" : 'Blog Name already exists',
                        'error' : 'Conflict',
                        "data" : None
                    },409
                return {
                    'message' : 'User Created Successfully !',
                    "data" :user
                },201
            except Exception as e:
                return{
                    'message' :'Something went wrong',
                    "error" : str(e),
                    "data" : None
                },500

@api.route('/login')
class Login(Resource):
    @api.expect(User_model)
    def post(self):
        try:
            data = request.json
            requiredFields = ['username', 'password']
            missing_fields = [field for field in requiredFields if not data.get(field) or not str(data.get(field)).strip()]  
            if missing_fields:
                return{
                    'message' : f'Please provide user details : {",".join(missing_fields)}',
                    'data' : None,
                    "error" : 'Bad Request'
                },400
            
            user = User().login(**data)

            if user:
                try :
                    token = jwt.encode({
                        'username': user.username,
                        'exp': datetime.utcnow() + timedelta(minutes=10)},
                        app.config["SECRET_KEY"],
                        algorithm="HS256"
                    )
                    return{
                        "message" : 'Successfully fetched the auth token',
                        'data': {
                            'username':user.username,
                        },
                        "token": token
                    }
                except Exception as e:
                    return{
                        "error" : 'Something went wrong',
                        "message" : str(e)
                    },500
            return{
                "message" : 'Error in fetching the auth token invalid username or password',
                'data' : None,
                "error" : 'Unauthorized'
            }, 401
        except Exception as e:
            return{
                "message" : 'Something went wrong',
                "error" : str(e),
                "data" : None
            },500


@api.route('/userDetails')
class userDetails(Resource):
    @token_required
    @api.expect(Post_model)
    def get(self, currentUser):
        try:
            blogname, postsCount = Post().getPostCountById(currentUser.username)
            if True :
                return {
                    'message' : 'Successfully retrieved the user details',
                    'data' : {
                        'username':currentUser.username,
                        'blogname': blogname,
                        'postsCount': postsCount
                    }
                },200
        except Exception as e:   
            return {
                'message' : ' Something went wrong',
                'error' : str(e),
                'data' : None
            },500

@api.route('/post/create')
class createPost(Resource):
    @token_required
    @api.expect(Post_model)
    def post(self, currentUser):
        try:
            data = request.json
            requiredFields = ['title', 'content', 'category']
            missing_fields = [field for field in requiredFields if not data.get(field) or not str(data.get(field)).strip()]
            
            if missing_fields:
                return{
                    'message' : f'Provide post Contents: {",".join(missing_fields)}',
                    "data" : None,
                    'error' : 'Bad Request'
                },400
            
            data["username"] = currentUser.username
            post = Post().create(**data)

            if post:
                return { 
                    'message' : 'Post Created Successfully',
                },201
            else:
                return{
                    'message' : 'Failed to create the post',
                    'error' : 'Could be invalid or DB error',
                    'data' : None
                },400
        except Exception as e:
            return {
                'message' : 'Failed to created the post',
                'error' : str(e),
                "data" : None
            },500
        
@api.route('/post/all')
class getUserAllPosts(Resource):
    @token_required
    def get(self, currentUser):
        try:
            posts = Post().getAllPosts(currentUser.username)
            if not posts:
                return {
                    'message' : 'No post',
                    "data" : []
                },200
            else :
                return {
                    'message' : 'Successfully retrieved all posts',
                    'data' : posts
                }
        except Exception as e:
            return {
                "message" : 'Failed to retrieve the posts',
                "error" : str(e),
                "data" : None
            },500
        
@api.route('/user/post/<int:id>')
class getFullPost(Resource):
    @token_required
    def get(self, currentUser, id):        
        try:
            post = Post().getById(currentUser, id)
            if not post:
                return{
                    "message" : 'Post not found',
                    "data" : None,
                    'error' : 'Not found'
                },404
            return {
                "message" : 'Successfully retrieved a post',
                "data" : post
            }
        except Exception as e:
            return {
                "message" : 'Something went wrong',
                "error" : str(e),
                'data' : None
            },500

        
@api.route('/post/<int:id>')
class getFullPostWithoutAuth(Resource):
    def get(self, id):        
        try:
            post = Post().getByIdWithoutAuth(id)
            if not post:
                return{
                    "message" : 'Post not found',
                    "data" : None,
                    'error' : 'Not found'
                },404
            return {
                "message" : 'Successfully retrieved a post',
                "data" : post
            }
        except Exception as e:
            return {
                "message" : 'Something went wrong',
                "error" : str(e),
                'data' : None
            },500

@api.route('/post/edit/<int:id>')
class Editpost(Resource):
    @token_required
    def put(self, currentUser, id):
        try:
            data = request.json
            requiredFields = ['title', 'content', 'category']
            missing_fields = [field for field in requiredFields if not data.get(field) or not str(data.get(field)).strip()]
            
            if missing_fields:
                return{
                    'message' : f'Provide post Contents: {",".join(missing_fields)}',
                    "data" : None,
                    'error' : 'Bad Request'
                },400
            
            post = Post().editPost(currentUser.username, id, **data)
            
            if not post:
                return{
                    'message' : 'Post not found',
                    'error' : 'Unauthorized'
                },403
            return {
                'message' : 'Post Edited Successfully'
            },201
        except Exception as e:
            return {
                'message' : 'Failed to edit the post',
                'error' : str(e),
                'data' : None
            },500
        
@api.route('/post/delete/<int:post_id>')
class deletePost(Resource):
    @token_required
    def delete(self, currentUser, post_id):
        try:
            post = Post().getById(currentUser,post_id)
            if not post:
                return{
                    'message' : 'Post not found',
                    'error' : 'Not found',
                    'data' : None
                },404
            Post().deletePost(post_id)
            return {
                'message' : "Successfully Deleted the post"
            }
        except Exception as e:
            return {
                'message' : 'Something went wrong',
                'error' : str(e),
                "data" : None
            },500

@api.route('/user/signout')
class signout(Resource):
    @token_required
    def post(self, currentUser):
        try:
            token = " "
            return{
                'message' : 'logged out successfully'
            }
        except Exception as e:
            return{
                'message' : 'Could not logout',
                'data' : None,
                'error' : str(e)
            },500
    
@api.route('/posts')
class Getallposts(Resource):
    def get(self):     
        try:
            limit = request.args.get('limit' , default=None, type=int)
            posts = Post().getPosts(limit)
            return {
                "message" : 'Successfully returned the posts',
                'data' : posts
            }
        except Exception as e:
            return {               
                "message" : 'Failed to retrieve the posts',
                'error' : str(e),
                'data' : None
            },500

@app.shell_context_processor
def make_shell_context():
    return{
        "db":db,
        "User":User
    }
    
if __name__ == "__main__":
    app.run()





