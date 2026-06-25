import random

def calculate_ai_intelligence(institution_data):
    """
    Calculates Heat Score, Priority, Conversion Probability, Potential Revenue, and Lead Category
    based on a robust set of rule-based logic to avoid relying on external AI APIs.
    """
    heat_score = 30 # Base score
    
    # 1. Student Strength Factor (Max +35)
    strength = institution_data.get('student_strength', 0)
    if strength > 15000:
        heat_score += 35
    elif strength > 5000:
        heat_score += 25
    elif strength > 1000:
        heat_score += 15
    else:
        heat_score += 5
        
    # 2. Program Interest Factor (Max +20)
    program = institution_data.get('program_interest', '').lower()
    if any(x in program for x in ['engineering', 'b.tech', 'medical', 'mba', 'management']):
        heat_score += 20
    elif any(x in program for x in ['arts', 'commerce', 'b.sc', 'general']):
        heat_score += 10

    # 3. Status Progression Factor (Max +15)
    status = institution_data.get('status', '')
    if status == 'Closed Won':
        heat_score = 100
    elif status == 'Negotiation':
        heat_score += 15
    elif status == 'Proposal Sent':
        heat_score += 10
    elif status == 'Meeting Scheduled':
        heat_score += 5
        
    # Ensure score bounds
    heat_score = min(max(heat_score, 0), 100)
    
    # Categorize based on score
    if heat_score >= 80:
        priority = 'High'
        category = 'Dream Lead'
    elif heat_score >= 50:
        priority = 'Medium'
        category = 'Growth Lead'
    else:
        priority = 'Low'
        category = 'Cold Lead'
        
    # Conversion probability scales with heat score, slightly randomized for realism
    variance = random.randint(-5, 5)
    conversion_prob = min(max(heat_score - 10 + variance, 5), 98)
    
    # Potential Revenue: roughly Rs. 50-100 per student in strength for the software platform
    revenue_per_student = random.choice([50, 75, 100])
    potential_revenue = strength * revenue_per_student
    if potential_revenue == 0:
        potential_revenue = random.randint(50000, 200000) # Baseline if strength missing
        
    return {
        'heat_score': heat_score,
        'priority': priority,
        'conversion_probability': conversion_prob,
        'potential_revenue': potential_revenue,
        'lead_category': category
    }

def generate_copilot_insights(institution):
    """
    Generates actionable insights and suggested outreach messages based on lead data.
    """
    status = institution.status
    priority = institution.priority
    name = institution.name
    strength = institution.student_strength
    
    insights = {
        'suggested_action': '',
        'reason': '',
        'outreach_message': '',
        'talking_points': []
    }
    
    if status == 'New Lead':
        if priority == 'High':
            insights['suggested_action'] = 'Immediate introductory call'
            insights['reason'] = f'High student strength ({strength}) aligns with our key demographic.'
            insights['outreach_message'] = f"Hi {institution.contact_person or 'Team'},\n\nI noticed {name} has a remarkable student base of over {strength}. Our platform specializes in automating academic workflows for institutions of your scale. Are you open to a brief 10-minute introduction this week?"
            insights['talking_points'] = ["Discuss scalable automation", "Mention case studies of similar sized institutions"]
        else:
            insights['suggested_action'] = 'Send automated email drip'
            insights['reason'] = 'Lead is still cold. Nurture before manual outreach.'
            insights['outreach_message'] = f"Hi {institution.contact_person or 'Team'},\n\nWe help institutions like {name} streamline operations. Here is a free resource on modernizing academic administration."
            insights['talking_points'] = ["General platform benefits", "Ask about their current tech stack"]
            
    elif status == 'Contacted':
        insights['suggested_action'] = 'Schedule product demo'
        insights['reason'] = 'Initial contact made. Time to showcase value.'
        insights['outreach_message'] = f"Hi {institution.contact_person or 'Team'},\n\nFollowing up on our last conversation. I'd love to show you how AcaIntel can specifically help {name} handle its {institution.program_interest} programs better."
        insights['talking_points'] = ["Highlight specific program workflows", "Demonstrate time-saving features"]
        
    elif status == 'Meeting Scheduled':
        insights['suggested_action'] = 'Prepare custom presentation'
        insights['reason'] = 'Meeting is locked in. Ensure high conversion.'
        insights['outreach_message'] = "No outreach needed right now. Focus on meeting prep."
        insights['talking_points'] = ["Identify current pain points", "Show ROI calculation for their size", "Introduce pricing tiers"]
        
    elif status == 'Proposal Sent':
        insights['suggested_action'] = 'Follow up on proposal'
        insights['reason'] = 'Awaiting decision. Keep engagement high.'
        insights['outreach_message'] = f"Hi {institution.contact_person or 'Team'},\n\nI wanted to check if you had any questions regarding the proposal for {name}. I'm available for a quick clarification call if needed."
        insights['talking_points'] = ["Address pricing concerns", "Offer implementation support"]
        
    elif status == 'Negotiation':
        insights['suggested_action'] = 'Offer implementation incentive'
        insights['reason'] = 'Close to winning. Needs a final push.'
        insights['outreach_message'] = f"Hi {institution.contact_person or 'Team'},\n\nTo help finalize our partnership, we'd like to offer complimentary onboarding and data migration for {name} if we can get everything signed by Friday."
        insights['talking_points'] = ["Reiterate ROI", "Discuss onboarding timeline"]
        
    else:
        insights['suggested_action'] = 'Review account health'
        insights['reason'] = 'Account is closed. Ensure success.'
        insights['outreach_message'] = 'N/A'
        insights['talking_points'] = ["Check in on user adoption"]
        
    return insights

def apply_automation_rules(institution):
    """
    Returns a list of task dicts to be created based on the current state.
    Simulating the IF/THEN rules from the requirements.
    """
    tasks_to_create = []
    
    # IF Lead Created THEN Create Follow-Up Task
    if institution.status == 'New Lead':
        tasks_to_create.append({
            'title': 'Initial Follow-Up Call',
            'task_type': 'Call',
            'priority': institution.priority,
            'days_due': 1
        })
        
    # IF Meeting Completed (Transitioned to Proposal Sent) THEN Recommend Proposal
    if institution.status == 'Meeting Scheduled':
        tasks_to_create.append({
            'title': 'Prepare & Send Proposal',
            'task_type': 'Proposal',
            'priority': 'High',
            'days_due': 2
        })
        
    return tasks_to_create
