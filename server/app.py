#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from flask_session import Session
import os

# Local imports
from models import Vehicle, Service, Mechanic, Client, Employee, db

# Setup
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Configuration
app.config.update(
    SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URI', 'postgresql://culserv_user:8yhQ89NpFb0hUnBiwfNqF5IsN5vZRaBI@dpg-cvhrkr1c1ekc738eq7kg-a.oregon-postgres.render.com/culserv'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    JSON_COMPACT=False,
    SECRET_KEY=os.environ.get('SECRET_KEY') or 'dev-key-change-me',
    SESSION_TYPE="filesystem",
    SESSION_COOKIE_NAME="vehicle_service_session",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=False,  # True in production with HTTPS
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=12),
    SESSION_PERMANENT=True
)

# Initialize extensions
Session(app)
db.init_app(app)
CORS(app, 
    supports_credentials=True,
    resources={r"/*": {"origins": "https://cul-serv.vercel.app/"}},
    expose_headers=["Content-Type"],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)
migrate = Migrate(app, db)

@app.after_request
def after_request(response):
    """Ensure responses have proper CORS headers and cache control"""
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
    return response

def get_logged_in_user():
    """Retrieve the currently logged in user from session"""
    user_id = session.get("user_id")
    if user_id:
        return Client.query.get(user_id)
    return None

def validate_request_data(data, required_fields):
    """Validate that required fields are present in request data"""
    for field in required_fields:
        if field not in data:
            return make_response(jsonify({"error": f"Missing field: {field}"}), 400)
    return None

# Routes
@app.route('/')
def index():
    return '<h1>Vehicle Service Management</h1>'

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    existing_user = Client.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_client = Client(name=name, email=email, password=hashed_password)
    db.session.add(new_client)
    db.session.commit()
    
    return jsonify({
        "message": "User registered successfully", 
        "user": new_client.to_dict(rules=('-password',))
    }), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Client.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Clear and set new session
    session.clear()
    session['user_id'] = user.id
    session.permanent = True
    session.modified = True
    
    return jsonify({
        "message": "Login successful", 
        "user": user.to_dict(rules=('-password',))
    }), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

# Vehicle routes
@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    user = get_logged_in_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    vehicles = Vehicle.query.filter_by(client_id=user.id).all()
    return jsonify([{
        'id': v.id,
        'make': v.make,
        'model': v.model,
        'year': v.year,
        'number_plate': v.number_plate,
        # 'current_mileage': v.current_mileage,
        'last_service_date': v.last_service_date.strftime('%Y-%m-%d') if v.last_service_date else None
    } for v in vehicles]), 200

@app.route('/vehicles/<int:id>', methods=['GET'])
def get_vehicle(id):
    user = get_logged_in_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    vehicle = Vehicle.query.filter_by(id=id, client_id=user.id).first()
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404

    return jsonify({
        'id': vehicle.id,
        'make': vehicle.make,
        'model': vehicle.model,
        'year': vehicle.year,
        'number_plate': vehicle.number_plate,
        # 'current_mileage': vehicle.current_mileage,
        'last_service_date': vehicle.last_service_date.strftime('%Y-%m-%d') if vehicle.last_service_date else None
    }), 200

@app.route('/vehicles', methods=['POST'])
def add_vehicle():
    user = get_logged_in_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    required_fields = ['make', 'model', 'year', 'number_plate', 'last_service_date']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400

    # Assign default mileage if None
    # current_mileage = data.get('current_mileage', 0)  # Default to 0

    try:
        new_vehicle = Vehicle(
            client_id=user.id,
            make=data['make'],
            model=data['model'],
            year=data['year'],
            number_plate=data['number_plate'],
            # current_mileage=current_mileage,
            last_service_date=datetime.strptime(data['last_service_date'], '%Y-%m-%d').date()
        )
        db.session.add(new_vehicle)
        db.session.commit()
        
        return jsonify({
            'message': 'Vehicle added successfully',
            'vehicle': {
                'id': new_vehicle.id,
                **{k: v for k, v in data.items() if k in required_fields}
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# **PATCH Route: Update a vehicle by ID**
@app.route('/vehicles/<int:id>', methods=['PATCH'])
def update_vehicle(id):
    vehicle = Vehicle.query.get(id)
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404

    data = request.get_json()
    if 'number_plate' in data:
        vehicle.number_plate = data['number_plate']
    # if 'current_mileage' in data:
    #     vehicle.current_mileage = data['current_mileage']
    if 'last_service_date' in data:
        vehicle.last_service_date = data['last_service_date']

    db.session.commit()
    return jsonify({'message': 'Vehicle updated successfully'}), 200

# **DELETE Route: Delete a vehicle by ID**
@app.route('/vehicles/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    vehicle = Vehicle.query.get(id)
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404

    db.session.delete(vehicle)
    db.session.commit()
    
    return jsonify({'message': 'Vehicle deleted successfully'}), 200

# # Vehicles Routes
# @app.route("/vehicles", methods=["GET", "POST"])
# def handle_vehicles():
#     if request.method == "GET":
#         vehicles = [vehicle.to_dict() for vehicle in Vehicle.query.all()]
#         return make_response(jsonify(vehicles), 200)

#     if request.method == "POST":
#         required_fields = ["make", "model", "year", "client_id"]
#         validation_error = validate_request_data(request.json, required_fields)
#         if validation_error:
#             return validation_error

#         new_vehicle = Vehicle(**request.json)
#         db.session.add(new_vehicle)
#         db.session.commit()
#         return make_response(jsonify(new_vehicle.to_dict()), 201)

# @app.route("/vehicles/<int:id>", methods=["GET", "PATCH", "DELETE"])
# def handle_vehicle_by_id(id):
#     vehicle = db.session.get(Vehicle, id)
#     if not vehicle:
#         return make_response(jsonify({"error": "Vehicle not found"}), 404)

#     if request.method == "GET":
#         return make_response(jsonify(vehicle.to_dict()), 200)

#     if request.method == "PATCH":
#         for key, value in request.json.items():
#             setattr(vehicle, key, value)
#         db.session.commit()
#         return make_response(jsonify(vehicle.to_dict()), 200)

#     if request.method == "DELETE":
#         db.session.delete(vehicle)
#         db.session.commit()
#         return make_response(jsonify({"message": "Vehicle deleted"}), 204)

### MECHANICS ROUTES ###
@app.route("/mechanics", methods=["GET", "POST"])
def handle_mechanics():
    if request.method == "GET":
        mechanics = [mechanic.to_dict() for mechanic in Mechanic.query.all()]
        return make_response(jsonify(mechanics), 200)

    if request.method == "POST":
        required_fields = ["name", "employee_id"]
        validation_error = validate_request_data(request.json, required_fields)
        if validation_error:
            return validation_error

        new_mechanic = Mechanic(**request.json)
        db.session.add(new_mechanic)
        db.session.commit()
        return make_response(jsonify(new_mechanic.to_dict()), 201)


@app.route("/mechanics/<int:id>", methods=["GET", "PATCH", "DELETE"])
def handle_mechanic_by_id(id):
    mechanic = db.session.get(Mechanic, id)
    if not mechanic:
        return make_response(jsonify({"error": "Mechanic not found"}), 404)

    if request.method == "GET":
        return make_response(jsonify(mechanic.to_dict()), 200)

    if request.method == "PATCH":
        for key, value in request.json.items():
            setattr(mechanic, key, value)
        db.session.commit()
        return make_response(jsonify(mechanic.to_dict()), 200)

    if request.method == "DELETE":
        db.session.delete(mechanic)
        db.session.commit()
        return make_response(jsonify({"message": "Mechanic deleted"}), 204)
    
### EMPLOYEES ROUTES ###
@app.route("/employees", methods=["GET", "POST"])
def handle_employees():
    if request.method == "GET":
        employees = [employee.to_dict() for employee in Employee.query.all()]
        return make_response(jsonify(employees), 200)

    if request.method == "POST":
        required_fields = ["name", "category"]
        validation_error = validate_request_data(request.json, required_fields)
        if validation_error:
            return validation_error

        new_employee = Employee(**request.json)
        db.session.add(new_employee)
        db.session.commit()
        return make_response(jsonify(new_employee.to_dict()), 201)

@app.route("/employees/<int:id>", methods=["GET", "PATCH", "DELETE"])
def handle_employee_by_id(id):
    employee = db.session.get(Employee, id)
    if not employee:
        return make_response(jsonify({"error": "Employee not found"}), 404)

    if request.method == "GET":
        return make_response(jsonify(employee.to_dict()), 200)

    if request.method == "PATCH":
        for key, value in request.json.items():
            setattr(employee, key, value)
        db.session.commit()
        return make_response(jsonify(employee.to_dict()), 200)

    if request.method == "DELETE":
        db.session.delete(employee)
        db.session.commit()
        return make_response(jsonify({"message": "Employee deleted"}), 204)
    
### Services ###
@app.route("/services", methods=["GET", "POST"])
def handle_services():
    if request.method == "POST":
        required_fields = ["description", "vehicle_id", "mechanic_id"]
        validation_error = validate_request_data(request.json, required_fields)
        if validation_error:
            return validation_error

        new_service = Service(**request.json)
        db.session.add(new_service)
        db.session.commit()
        return make_response(jsonify(new_service.to_dict()), 201)

    services = Service.query.all()
    return make_response(jsonify([service.to_dict() for service in services]), 200)

@app.route("/services/<int:service_id>", methods=["GET", "PATCH", "DELETE"])
def handle_service_by_id(service_id):
    service = Service.query.get(service_id)

    if not service:
        return make_response(jsonify({"error": "Service not found"}), 404)

    if request.method == "GET":
        return make_response(jsonify(service.to_dict()), 200)

    elif request.method == "PATCH":  # Allow partial updates
        for key, value in request.json.items():
            setattr(service, key, value)

        db.session.commit()
        return make_response(jsonify(service.to_dict()), 200)

    elif request.method == "DELETE":
        db.session.delete(service)
        db.session.commit()
        return make_response(jsonify({"message": "Service deleted successfully"}), 200)


### Get all vehicles associated with a specific client
@app.route("/clients/<int:client_id>/vehicles", methods=["GET"])
def get_client_vehicles(client_id):
    client = db.session.get(Client, client_id)
    if not client:
        return make_response(jsonify({"error": "Client not found"}), 404)

    vehicles = [vehicle.to_dict() for vehicle in client.vehicles]
    return make_response(jsonify(vehicles), 200)

### Get vehicles serviced by a specific mechanic ###
@app.route("/mechanics/<int:mechanic_id>/vehicles", methods=["GET"])
def get_mechanic_vehicles(mechanic_id):
    mechanic = db.session.get(Mechanic, mechanic_id)
    if not mechanic:
        return make_response(jsonify({"error": "Mechanic not found"}), 404)

    # Get all vehicles that have been serviced by this mechanic
    vehicles = {service.vehicle.to_dict() for service in mechanic.services}

    return make_response(jsonify(list(vehicles)), 200)

### Get the client associated with a specific vehicle ###
@app.route("/vehicles/<int:vehicle_id>/client", methods=["GET"])
def get_vehicle_client(vehicle_id):
    vehicle = db.session.get(Vehicle, vehicle_id)
    if not vehicle:
        return make_response(jsonify({"error": "Vehicle not found"}), 404)

    return make_response(jsonify(vehicle.client.to_dict()), 200)


if __name__ == "__main__":
    app.run(port=5555, debug=True)
