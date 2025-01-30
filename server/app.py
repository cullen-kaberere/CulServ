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

### CLIENTS ROUTES ###
@app.route("/clients", methods=["GET", "POST"])
def handle_clients():
    if request.method == "GET":
        clients = [client.to_dict() for client in Client.query.all()]
        return make_response(jsonify(clients), 200)

    if request.method == "POST":
        required_fields = ["name", "email"]
        validation_error = validate_request_data(request.json, required_fields)
        if validation_error:
            return validation_error

        new_client = Client(**request.json)
        db.session.add(new_client)
        db.session.commit()
        return make_response(jsonify(new_client.to_dict()), 201)

@app.route("/clients/<int:id>", methods=["GET", "PATCH", "DELETE"])
def handle_client_by_id(id):
    client = db.session.get(Client, id)
    if not client:
        return make_response(jsonify({"error": "Client not found"}), 404)

    if request.method == "GET":
        return make_response(jsonify(client.to_dict()), 200)

    if request.method == "PATCH":
        for key, value in request.json.items():
            setattr(client, key, value)
        db.session.commit()
        return make_response(jsonify(client.to_dict()), 200)

    if request.method == "DELETE":
        db.session.delete(client)
        db.session.commit()
        return make_response(jsonify({"message": "Client deleted"}), 204)

# Vehicles Routes
@app.route("/vehicles", methods=["GET", "POST"])
def handle_vehicles():
    if request.method == "GET":
        vehicles = [vehicle.to_dict() for vehicle in Vehicle.query.all()]
        return make_response(jsonify(vehicles), 200)

    if request.method == "POST":
        required_fields = ["make", "model", "year", "client_id"]
        validation_error = validate_request_data(request.json, required_fields)
        if validation_error:
            return validation_error

        new_vehicle = Vehicle(**request.json)
        db.session.add(new_vehicle)
        db.session.commit()
        return make_response(jsonify(new_vehicle.to_dict()), 201)

@app.route("/vehicles/<int:id>", methods=["GET", "PATCH", "DELETE"])
def handle_vehicle_by_id(id):
    vehicle = db.session.get(Vehicle, id)
    if not vehicle:
        return make_response(jsonify({"error": "Vehicle not found"}), 404)

    if request.method == "GET":
        return make_response(jsonify(vehicle.to_dict()), 200)

    if request.method == "PATCH":
        for key, value in request.json.items():
            setattr(vehicle, key, value)
        db.session.commit()
        return make_response(jsonify(vehicle.to_dict()), 200)

    if request.method == "DELETE":
        db.session.delete(vehicle)
        db.session.commit()
        return make_response(jsonify({"message": "Vehicle deleted"}), 204)

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

@app.route("/services/<int:service_id>", methods=["GET", "PUT", "DELETE"])
def handle_service_by_id(service_id):
    service = Service.query.get(service_id)

    if not service:
        return make_response(jsonify({"error": "Service not found"}), 404)

    if request.method == "GET":
        return make_response(jsonify(service.to_dict()), 200)

    elif request.method == "PUT":
        required_fields = ["description", "vehicle_id", "mechanic_id"]
        validation_error = validate_request_data(request.json, required_fields)
        if validation_error:
            return validation_error

        # Update the service details
        for key, value in request.json.items():
            setattr(service, key, value)

        db.session.commit()
        return make_response(jsonify(service.to_dict()), 200)

    elif request.method == "DELETE":
        db.session.delete(service)
        db.session.commit()
        return make_response(jsonify({"message": "Service deleted successfully"}), 200)


if __name__ == "__main__":
    app.run(port=5555, debug=True)
