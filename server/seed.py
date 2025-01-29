#!/usr/bin/env python3

# Standard library imports
from random import choice as rc
from datetime import date, timedelta
from faker import Faker

# Local imports
from app import app
from models import db, Client, Vehicle, Service, Mechanic, Employee

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        print("Clearing existing data...")
        db.session.query(Service).delete()
        db.session.query(Mechanic).delete()
        db.session.query(Employee).delete()
        db.session.query(Vehicle).delete()
        db.session.query(Client).delete()

        db.session.commit()

        # Seed clients
        print("Seeding clients...")
        clients = [Client(name=fake.name(), email=fake.unique.email()) ]
        db.session.add_all(clients)
        db.session.commit()

        # Seed vehicles
        print("Seeding vehicles...")
        vehicles = [
            Vehicle(
                make=fake.company(),
                model=fake.word(),
                year=fake.year(),
                client_id=rc(clients).id
            ) 
        ]
        db.session.add_all(vehicles)
        db.session.commit()

        # Seed employees
        print("Seeding employees...")
        employees = [Employee(name=fake.name(), category=fake.job()) ]
        db.session.add_all(employees)
        db.session.commit()

        # Seed mechanics
        print("Seeding mechanics...")
        mechanics = [
            Mechanic(
                name=fake.name(),
                specialty=fake.job(),
                employee_id=rc(employees).id
            ) 
        ]
        db.session.add_all(mechanics)
        db.session.commit()

        # Seed services
        print("Seeding services...")
        services = [
            Service(
                description=fake.sentence(),
                cost=fake.pyfloat(left_digits=3, right_digits=2, positive=True),
                date=fake.date_between(start_date='-1y', end_date='today'),
                vehicle_id=rc(vehicles).id,
                mechanic_id=rc(mechanics).id
            ) 
        ]
        db.session.add_all(services)
        db.session.commit()

        print("Seeding complete!")
