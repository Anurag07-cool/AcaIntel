from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from models import db, User, Institution, Task, TimelineEvent, to_dict
from auth_middleware import token_required
from ai_engine import calculate_ai_intelligence, generate_copilot_insights, apply_automation_rules

api_bp = Blueprint('api', __name__)

# --- Authentication Routes ---

@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    new_user = User(
        name=data['name'], 
        email=data['email'], 
        password=hashed_password,
        role=data.get('role', 'Sales Executive')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Registered successfully'}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    auth = request.get_json()
    
    if not auth or not auth.get('email') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401
        
    user = User.query.filter_by(email=auth.get('email')).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 401
        
    if check_password_hash(user.password, auth.get('password')):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        })
        
    return jsonify({'message': 'Wrong password'}), 401

# --- Dashboard & Metrics ---

@api_bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    total_institutions = Institution.query.filter_by(owner_id=current_user.id).count()
    active_leads = Institution.query.filter(
        Institution.owner_id == current_user.id,
        Institution.status.in_(['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation'])
    ).count()
    high_priority = Institution.query.filter_by(owner_id=current_user.id, priority='High').count()
    meetings_scheduled = Institution.query.filter_by(owner_id=current_user.id, status='Meeting Scheduled').count()
    closed_won = Institution.query.filter_by(owner_id=current_user.id, status='Closed Won').count()
    
    conversion_rate = round((closed_won / total_institutions * 100), 1) if total_institutions > 0 else 0
    
    # Calculate revenue
    institutions = Institution.query.filter_by(owner_id=current_user.id).all()
    potential_revenue = sum([i.potential_revenue for i in institutions])
    
    # Generate insights
    insights = []
    if total_institutions == 0:
        insights.append("Welcome! Add your first institution to start seeing AI insights.")
    else:
        dream_leads = Institution.query.filter_by(owner_id=current_user.id, lead_category='Dream Lead').count()
        if high_priority > 0:
            insights.append(f"{high_priority} high-value institutions need attention")
        if dream_leads > 0:
            insights.append(f"{dream_leads} Dream Leads in the pipeline")
        if len(insights) == 0:
            insights.append("Keep growing your pipeline to uncover high-value opportunities.")
            
    # Generate realistic dynamic chart data based on user's current numbers
    growth_data = []
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    for i, m in enumerate(months):
        if total_institutions == 0:
            growth_data.append({'name': m, 'leads': 0, 'won': 0})
        else:
            # Simulate historical growth leading up to current numbers
            factor = (i + 1) / 6.0
            growth_data.append({
                'name': m,
                'leads': int(total_institutions * factor),
                'won': int(closed_won * factor)
            })
    
    return jsonify({
        'metrics': {
            'total_institutions': total_institutions,
            'active_leads': active_leads,
            'high_priority': high_priority,
            'meetings_scheduled': meetings_scheduled,
            'conversion_rate': conversion_rate,
            'potential_revenue': potential_revenue,
            'growth_data': growth_data
        },
        'insights': insights
    })

# --- Institutions Management ---

@api_bp.route('/institutions', methods=['GET'])
@token_required
def get_institutions(current_user):
    institutions = Institution.query.filter_by(owner_id=current_user.id).all()
    return jsonify([to_dict(i) for i in institutions])

@api_bp.route('/institutions/<int:id>', methods=['GET'])
@token_required
def get_institution(current_user, id):
    institution = Institution.query.filter_by(id=id, owner_id=current_user.id).first_or_404()
    return jsonify(to_dict(institution))

@api_bp.route('/institutions', methods=['POST'])
@token_required
def create_institution(current_user):
    data = request.get_json()
    
    # Calculate initial AI metrics
    ai_data = calculate_ai_intelligence(data)
    
    new_inst = Institution(
        name=data['name'],
        location=data.get('location', ''),
        contact_person=data.get('contact_person', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        institution_type=data.get('institution_type', ''),
        student_strength=data.get('student_strength', 0),
        program_interest=data.get('program_interest', ''),
        lead_source=data.get('lead_source', ''),
        status='New Lead',
        owner_id=current_user.id,
        **ai_data
    )
    
    db.session.add(new_inst)
    db.session.flush() # get ID
    
    # Create timeline event
    event = TimelineEvent(institution_id=new_inst.id, event_type='Lead Created', description='Lead was manually added to the system.')
    db.session.add(event)
    
    # Apply rules
    tasks = apply_automation_rules(new_inst)
    for t in tasks:
        new_task = Task(
            institution_id=new_inst.id,
            title=t['title'],
            task_type=t['task_type'],
            priority=t['priority'],
            due_date=datetime.datetime.utcnow() + datetime.timedelta(days=t['days_due'])
        )
        db.session.add(new_task)
        
    db.session.commit()
    
    return jsonify(to_dict(new_inst)), 201

@api_bp.route('/institutions/<int:id>/status', methods=['PUT'])
@token_required
def update_status(current_user, id):
    institution = Institution.query.filter_by(id=id, owner_id=current_user.id).first_or_404()
    data = request.get_json()
    
    new_status = data.get('status')
    if new_status and new_status != institution.status:
        old_status = institution.status
        institution.status = new_status
        institution.last_activity = datetime.datetime.utcnow()
        
        # Recalculate AI score
        ai_data = calculate_ai_intelligence(to_dict(institution))
        for key, value in ai_data.items():
            setattr(institution, key, value)
            
        # Create timeline event
        event = TimelineEvent(institution_id=institution.id, event_type=new_status, description=f'Status changed from {old_status} to {new_status}')
        db.session.add(event)
        
        # Apply rules
        tasks = apply_automation_rules(institution)
        for t in tasks:
            new_task = Task(
                institution_id=institution.id,
                title=t['title'],
                task_type=t['task_type'],
                priority=t['priority'],
                due_date=datetime.datetime.utcnow() + datetime.timedelta(days=t.get('days_due', 1))
            )
            db.session.add(new_task)
            
        db.session.commit()
        
    return jsonify(to_dict(institution))

@api_bp.route('/institutions/<int:id>/copilot', methods=['GET'])
@token_required
def get_copilot_insights(current_user, id):
    institution = Institution.query.filter_by(id=id, owner_id=current_user.id).first_or_404()
    insights = generate_copilot_insights(institution)
    
    return jsonify(insights)

# --- Tasks & Timeline ---

@api_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = db.session.query(Task, Institution).join(Institution).filter(Institution.owner_id == current_user.id).order_by(Task.due_date.asc()).all()
    
    result = []
    for t, i in tasks:
        task_dict = to_dict(t)
        task_dict['institution_name'] = i.name
        result.append(task_dict)
        
    return jsonify(result)

@api_bp.route('/tasks/<int:id>/complete', methods=['PUT'])
@token_required
def complete_task(current_user, id):
    task = Task.query.join(Institution).filter(Task.id == id, Institution.owner_id == current_user.id).first_or_404()
    task.status = 'Completed'
    db.session.commit()
    return jsonify({'message': 'Task completed'})

@api_bp.route('/institutions/<int:id>/timeline', methods=['GET'])
@token_required
def get_timeline(current_user, id):
    institution = Institution.query.filter_by(id=id, owner_id=current_user.id).first_or_404()
    events = TimelineEvent.query.filter_by(institution_id=id).order_by(TimelineEvent.created_at.desc()).all()
    return jsonify([to_dict(e) for e in events])
