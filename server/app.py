#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# Local imports
from models import Vehicle, Service, Mechanic, Client, Employee, db

# Setup
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db.init_app(app)
CORS(app)
migrate = Migrate(app, db)

# Utility function to validate required fields in request data
def validate_request_data(data, required_fields):
    for field in required_fields:
        if field not in data:
            return make_response(jsonify({"error": f"Missing field: {field}"}), 400)
    return None

# Routes
@app.route('/')
def index():
    return '<h1>Vehicle Service Management</h1>'

# Vehicles Routes
@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicles = [vehicle.to_dict() for vehicle in Vehicle.query.all()]
    return make_response(jsonify(vehicles), 200)

@app.route('/vehicles', methods=['POST'])
def create_vehicle():
    required_fields = ["make", "model", "year", "client_id"]
    validation_error = validate_request_data(request.json, required_fields)
    if validation_error:
        return validation_error

    new_vehicle = Vehicle(
        make=request.json["make"],
        model=request.json["model"],
        year=request.json["year"],
        client_id=request.json["client_id"]
    )
    db.session.add(new_vehicle)
    db.session.commit()
    return make_response(new_vehicle.to_dict(), 201)

@app.route('/vehicles/<int:id>', methods=['PATCH'])
def update_vehicle(id):
    vehicle = db.session.get(Vehicle, id)
    if not vehicle:
        return make_response(jsonify({"error": "Vehicle not found"}), 404)

    for key, value in request.json.items():
        setattr(vehicle, key, value)
    db.session.commit()
    return make_response(vehicle.to_dict(), 200)

@app.route('/vehicles/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    vehicle = db.session.get(Vehicle, id)
    if not vehicle:
        return make_response(jsonify({"error": "Vehicle not found"}), 404)

    db.session.delete(vehicle)
    db.session.commit()
    return make_response({"message": "Vehicle deleted"}, 204)

# Mechanics Routes
@app.route('/mechanics', methods=['GET'])
def get_mechanics():
    mechanics = [mechanic.to_dict() for mechanic in Mechanic.query.all()]
    return make_response(jsonify(mechanics), 200)

@app.route('/mechanics', methods=['POST'])
def create_mechanic():
    required_fields = ["name", "specialty", "employee_id"]
    validation_error = validate_request_data(request.json, required_fields)
    if validation_error:
        return validation_error

    new_mechanic = Mechanic(
        name=request.json["name"],
        specialty=request.json["specialty"],
        employee_id=request.json["employee_id"]
    )
    db.session.add(new_mechanic)
    db.session.commit()
    return make_response(new_mechanic.to_dict(), 201)

@app.route('/mechanics/<int:id>', methods=['PATCH'])
def update_mechanic(id):
    mechanic = db.session.get(Mechanic, id)
    if not mechanic:
        return make_response(jsonify({"error": "Mechanic not found"}), 404)

    for key, value in request.json.items():
        setattr(mechanic, key, value)
    db.session.commit()
    return make_response(mechanic.to_dict(), 200)

@app.route('/mechanics/<int:id>', methods=['DELETE'])
def delete_mechanic(id):
    mechanic = db.session.get(Mechanic, id)
    if not mechanic:
        return make_response(jsonify({"error": "Mechanic not found"}), 404)

    db.session.delete(mechanic)
    db.session.commit()
    return make_response({"message": "Mechanic deleted"}, 204)

# Services Routes
@app.route('/services', methods=['GET'])
def get_services():
    services = [service.to_dict() for service in Service.query.all()]
    return make_response(jsonify(services), 200)

@app.route('/services', methods=['POST'])
def create_service():
    required_fields = ["description", "cost", "vehicle_id", "mechanic_id", "date"]
    validation_error = validate_request_data(request.json, required_fields)
    if validation_error:
        return validation_error

    new_service = Service(
        description=request.json["description"],
        cost=request.json["cost"],
        vehicle_id=request.json["vehicle_id"],
        mechanic_id=request.json["mechanic_id"],
        date=request.json["date"]
    )
    db.session.add(new_service)
    db.session.commit()
    return make_response(new_service.to_dict(), 201)

@app.route('/services/<int:id>', methods=['PATCH'])
def update_service(id):
    service = db.session.get(Service, id)
    if not service:
        return make_response(jsonify({"error": "Service not found"}), 404)

    for key, value in request.json.items():
        setattr(service, key, value)
    db.session.commit()
    return make_response(service.to_dict(), 200)

@app.route('/services/<int:id>', methods=['DELETE'])
def delete_service(id):
    service = db.session.get(Service, id)
    if not service:
        return make_response(jsonify({"error": "Service not found"}), 404)

    db.session.delete(service)
    db.session.commit()
    return make_response({"message": "Service deleted"}, 204)

# Clients Routes
@app.route('/clients', methods=['GET'])
def get_clients():
    clients = [client.to_dict() for client in Client.query.all()]
    return make_response(jsonify(clients), 200)

@app.route('/clients', methods=['POST'])
def create_client():
    required_fields = ["name", "email"]
    validation_error = validate_request_data(request.json, required_fields)
    if validation_error:
        return validation_error

    new_client = Client(
        name=request.json["name"],
        email=request.json["email"]
    )
    db.session.add(new_client)
    db.session.commit()
    return make_response(new_client.to_dict(), 201)

@app.route('/clients/<int:id>', methods=['GET'])
def get_client(id):
    client = db.session.get(Client, id)
    if not client:
        return make_response(jsonify({"error": "Client not found"}), 404)
    return make_response(jsonify(client.to_dict()), 200)

@app.route('/clients/<int:id>', methods=['PATCH'])
def update_client(id):
    client = db.session.get(Client, id)
    if not client:
        return make_response(jsonify({"error": "Client not found"}), 404)

    for key, value in request.json.items():
        setattr(client, key, value)
    db.session.commit()
    return make_response(client.to_dict(), 200)

@app.route('/clients/<int:id>', methods=['DELETE'])
def delete_client(id):
    client = db.session.get(Client, id)
    if not client:
        return make_response(jsonify({"error": "Client not found"}), 404)

    db.session.delete(client)
    db.session.commit()
    return make_response({"message": "Client deleted"}, 204)

# Employees Routes
@app.route('/employees', methods=['GET'])
def get_employees():
    employees = [employee.to_dict() for employee in Employee.query.all()]
    return make_response(jsonify(employees), 200)

@app.route('/employees', methods=['POST'])
def create_employee():
    required_fields = ["name", "category"]
    validation_error = validate_request_data(request.json, required_fields)
    if validation_error:
        return validation_error

    new_employee = Employee(
        name=request.json["name"],
        category=request.json["category"]
    )
    db.session.add(new_employee)
    db.session.commit()
    return make_response(new_employee.to_dict(), 201)

@app.route('/employees/<int:id>', methods=['PATCH'])
def update_employee(id):
    employee = db.session.get(Employee, id)
    if not employee:
        return make_response(jsonify({"error": "Employee not found"}), 404)

    for key, value in request.json.items():
        setattr(employee, key, value)
    db.session.commit()
    return make_response(employee.to_dict(), 200)

@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = db.session.get(Employee, id)
    if not employee:
        return make_response(jsonify({"error": "Employee not found"}), 404)

    db.session.delete(employee)
    db.session.commit()
    return make_response({"message": "Employee deleted"}, 204)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
