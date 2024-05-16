from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import re
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token
from bson import ObjectId



MONGO_URI = 'mongodb+srv://e55:raghav@cluster0.mnkjut6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
DB_NAME = 'Users'

# Initialize the MongoClient
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

login_bp = Blueprint("login", __name__)

# Regular expression for validating an Email
regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

def check_email(email):
    # pass the regular expression and the string into the fullmatch() method
    if re.fullmatch(regex, email):
        return True
    else:
        return False



@login_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name=data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number')
    address = data.get('address')

    # Validate the data
    if not email or not password :
        return jsonify({'error': 'Missing email, password '}), 400

    # Check if email is valid
    if not check_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    # Check if email already exists
    if db.users.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 409

    hashed_password = generate_password_hash(password)
    # Store the user in the database
    db.users.insert_one({'name': name,'email': email,'phone_number': phone_number, 'password': hashed_password,'address': address})
    return jsonify({'message': 'User created successfully'}), 201






@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('name')  # Assuming 'name' is the username
    password = data.get('password')

    # Validate the data
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    # Fetch the user from the database
    user = db.users.find_one({'name': username})

    # Check if the user exists and the password is correct
    if user and check_password_hash(user['password'], password):
        # Generate a JWT token containing the user's username
        access_token = create_access_token(identity=username)
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401




# Route to get user details
@login_bp.route('/user_details', methods=['GET'])
@jwt_required()  # Requires authentication
def get_user_details():
    # Get the current user's name from the JWT token
    current_user_name = get_jwt_identity()

    # Fetch user details from the database based on the name
    user = db.users.find_one({'name': current_user_name}, {'_id': 0, 'password': 0})  # Exclude password field

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Convert ObjectId to string for JSON serialization
    user['_id'] = str(user.get('_id'))

    return jsonify(user), 200