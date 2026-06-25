from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default='Sales Executive')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Institution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    institution_type = db.Column(db.String(100)) # e.g. University, College
    student_strength = db.Column(db.Integer, default=0)
    program_interest = db.Column(db.String(200)) # e.g. B.Tech, MBA, General
    lead_source = db.Column(db.String(100))
    status = db.Column(db.String(50), default='New Lead') # New Lead, Contacted, Meeting Scheduled, Proposal Sent, Negotiation, Closed Won, Closed Lost
    notes = db.Column(db.Text)
    
    # AI Fields
    heat_score = db.Column(db.Integer, default=0) # 0-100
    priority = db.Column(db.String(50), default='Low') # High, Medium, Low
    conversion_probability = db.Column(db.Integer, default=0) # 0-100%
    potential_revenue = db.Column(db.Integer, default=0) # e.g. 350000
    lead_category = db.Column(db.String(50)) # Dream Lead, Growth Lead, Cold Lead

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institution.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    task_type = db.Column(db.String(50)) # Call, Meeting, Email, Proposal, Reminder
    priority = db.Column(db.String(50)) # High, Medium, Low
    status = db.Column(db.String(50), default='Pending') # Pending, Completed
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institution.id'), nullable=False)
    event_type = db.Column(db.String(100), nullable=False) # e.g. Lead Created, Contacted, Meeting
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

def to_dict(model_instance):
    """Utility to convert SQLAlchemy object to dict."""
    return {c.name: getattr(model_instance, c.name) for c in model_instance.__table__.columns}
