import random
import datetime
from app import create_app
from models import db, User, Institution, Task, TimelineEvent
from werkzeug.security import generate_password_hash
from ai_engine import calculate_ai_intelligence

app = create_app()

def seed_database():
    with app.app_context():
        # Drop and create tables
        db.drop_all()
        db.create_all()
        print("Database tables created.")
        
        # 1. Create User
        user = User(
            name="Alex Admin",
            email="admin@acaintel.com",
            password=generate_password_hash("password123", method="pbkdf2:sha256"),
            role="Sales Manager"
        )
        db.session.add(user)
        db.session.commit()
        print(f"Created user: {user.email}")
        
        # 2. Seed Institutions
        domains = ["University", "College", "Institute of Technology", "Business School"]
        locations = ["New York, NY", "Austin, TX", "San Francisco, CA", "Boston, MA", "Seattle, WA", "Chicago, IL", "Denver, CO", "Atlanta, GA"]
        programs = ["B.Tech, M.Tech", "MBA, BBA", "Medical, Dental", "Arts, Humanities", "General Sciences", "Engineering, Business"]
        statuses = ["New Lead", "Contacted", "Meeting Scheduled", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"]
        sources = ["Inbound Web", "Conference", "Outbound Email", "Referral", "LinkedIn"]
        
        institutions = []
        for i in range(1, 121):  # 120 dummy institutions
            name = f"State {domains[i%len(domains)]} {i}"
            loc = random.choice(locations)
            strength = random.randint(500, 25000)
            status = random.choices(statuses, weights=[25, 20, 15, 10, 10, 10, 10])[0]
            
            data = {
                'student_strength': strength,
                'program_interest': random.choice(programs),
                'status': status
            }
            ai_data = calculate_ai_intelligence(data)
            
            inst = Institution(
                name=name,
                location=loc,
                contact_person=f"Contact {i}",
                email=f"contact{i}@example.edu",
                phone=f"555-01{i:02d}",
                institution_type=random.choice(domains),
                student_strength=strength,
                program_interest=data['program_interest'],
                lead_source=random.choice(sources),
                status=status,
                owner_id=user.id,
                **ai_data
            )
            
            # Simulate historical activity
            days_ago = random.randint(0, 30)
            inst.created_at = datetime.datetime.utcnow() - datetime.timedelta(days=days_ago)
            inst.last_activity = datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, days_ago))
            
            db.session.add(inst)
            institutions.append(inst)
            
        db.session.commit()
        print(f"Created {len(institutions)} institutions.")
        
        # 3. Seed Events and Tasks
        for inst in institutions:
            # Event
            event = TimelineEvent(
                institution_id=inst.id,
                event_type="Lead Created",
                description="Lead originated from system import.",
                created_at=inst.created_at
            )
            db.session.add(event)
            
            # Tasks
            if inst.status in ["New Lead", "Contacted", "Meeting Scheduled"]:
                task = Task(
                    institution_id=inst.id,
                    title=f"Follow up with {inst.name}",
                    task_type=random.choice(["Call", "Email", "Meeting"]),
                    priority=inst.priority,
                    status="Pending" if random.choice([True, False]) else "Completed",
                    due_date=datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(-2, 5))
                )
                db.session.add(task)
                
        db.session.commit()
        print("Created timeline events and tasks.")
        
if __name__ == '__main__':
    seed_database()
