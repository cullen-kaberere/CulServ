from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

# Configure metadata
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize the database
db = SQLAlchemy(metadata=metadata)

# Models
class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)

    vehicles = db.relationship('Vehicle', backref='client', cascade="all, delete-orphan")
    serialize_rules = ('-vehicles.client',)


class Vehicle(db.Model, SerializerMixin):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String, nullable=False)
    model = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)

    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    services = db.relationship('Service', backref='vehicle', cascade="all, delete-orphan")
    serialize_rules = ('-services.vehicle', '-client.vehicles')


class Service(db.Model, SerializerMixin):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    mechanic_id = db.Column(db.Integer, db.ForeignKey('mechanics.id'), nullable=False)

    serialize_rules = ('-vehicle.services', '-mechanic.services')



class Mechanic(db.Model, SerializerMixin):
    __tablename__ = 'mechanics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    

    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    services = db.relationship('Service', backref='mechanic', cascade="all, delete-orphan")
    serialize_rules = ('-employee.mechanics', '-services.mechanic')


class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)

    mechanics = db.relationship('Mechanic', backref='employee', cascade="all, delete-orphan")
    serialize_rules = ('-mechanics.employee',)
