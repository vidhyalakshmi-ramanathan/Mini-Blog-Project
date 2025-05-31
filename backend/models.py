from exts import db
from passlib.hash import sha256_crypt as encrypt
from datetime import datetime,timezone

class User(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    username = db.Column(db.String(80),unique = True, nullable=False)
    password = db.Column(db.String(200),nullable=False)
    blogname = db.Column(db.String(100),unique=True,nullable=False)
    
    def __repr__(self):
        return f"<User {self.id}>"
    
    def to_dict(self):
        return{
            "id" : self.id,
            "username" : self.username,
            "blogname" : self.blogname
        }
    def create(self, username = "", password = "", blogname = ""):
        user = self.getUserByUsername(username)
        if user:
            return "username already exists"
        
        password = self.encrypt_password(password)
        blog = self.checkBlogname(blogname)
        if blog:
            return "blogname already exists"
        newUser = User(username = username,password = password, blogname = blogname)
        db.session.add(newUser)
        db.session.commit()
        return username

    def checkBlogname(self,blogname):
        getBlogname = User.query.filter_by(blogname = blogname).first()
        if not getBlogname:
            return False
        return getBlogname
           
    def getUserByUsername(self, username):  
        # Checking the existing user
        getUsername = User.query.filter_by(username = username).first()
        if not getUsername:
            return False
        return getUsername
    
    def encrypt_password(self, password):
        return encrypt.hash(password)
    
    def login(self, username, password):
        user = self.getUserByUsername(username)
        if not user or not encrypt.verify(password, user.password):
            return False
        return self.getUserByUsername(username)
    
class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)   
    title = db.Column(db.String(120), nullable = False)   
    content = db.Column(db.Text, nullable = False)   
    category = db.Column(db.String(50), nullable = False)   
    created_at = db.Column(db.DateTime, nullable = False, default =lambda: datetime.now(timezone.utc))   
    username = db.Column(db.String(80), db.ForeignKey('user.username'), nullable = False)   

    def __repr__(self):
        return f"<Post {self.id}>"
    
    def create(self, title = "", content = "", category = "", username = ""):
        try:
            author = self.getUserByUsername(username)
            if author:
                newPost = Post(username = username, title = title, content = content, category = category)
                db.session.add(newPost)
                db.session.commit()
                return True
        except Exception as e:
            db.session.rollback()
            print("error",e)
            return False    
        
    def getUserByUsername(self, username):
        getUsername = User.query.filter_by(username = username).first()
        if not getUsername:
            return False
        return getUsername
    
    def getPostCountById(self, username):
        blogname = User.query.filter_by(username = username).with_entities(User.blogname).first()
        if blogname:
            blogname = blogname[0]
        postCount=  Post.query.filter_by(username = username).count()
        return [blogname,postCount]
    
    def to_dict(self):
        return{
            'id':self.id,
            'title':self.title,
            'content':self.content,
            'category':self.category,
            'created_at':self.created_at.isoformat(),
            'username':self.username,
            
        }
    def getAllPosts(self, username):
        posts = Post.query.filter_by(username = username).order_by(Post.created_at.desc()).all()
        if not posts:
            return False
        return [post.to_dict() for post in posts]
    
    def getById(self, currentUser, post_id):
        post = Post.query.filter_by(id = post_id, username = currentUser.username).first()
        if not post:
            return []
        isAuthor = (currentUser.username == post.username)
        post = post.to_dict()
        post['isAuthor'] = isAuthor
        return post

    def deletePost(self, post_id):
        post = Post.query.filter_by(id = post_id).first()
        if post :
            db.session.delete(post)
            db.session.commit()
            return True
        return False

    def editPost(self, username = "", id= "", title = "", content = "", category = ""):
        user = self.getUserByUsername(username)
        if not user:
            return False
        post = Post.query.filter_by(id = id, username = username).first()
        if not post:
            return False
        post.title = title
        post.content =content
        post.category = category
        post.created_at = datetime.now(timezone.utc)
        db.session.commit()
        return post
    
    def getPosts(self, limit):    
        if limit:
            posts = Post.query.order_by(Post.created_at.desc()).limit(limit).all()
        else:
            posts = Post.query.order_by(Post.created_at.desc()).all()
        return  [post.to_dict() for post in posts]
    
    def getByIdWithoutAuth(self, post_id):
        post = Post.query.filter_by(id = post_id).first()
        if not post:
            return []
        post = post.to_dict()
        return post