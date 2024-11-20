from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.User import User

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    new_user.save()
    return jsonify({"message": "User registered successfully!"})

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.objects(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({"message": "Login successful!"})
    return jsonify({"message": "Invalid credentials!"}), 401