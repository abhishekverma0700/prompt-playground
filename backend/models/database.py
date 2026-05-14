from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Prompt(db.Model):
    __tablename__ = 'prompts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    system_prompt = db.Column(db.Text, default="")
    user_prompt = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), default="General")
    tags = db.Column(db.String(500), default="")
    technique = db.Column(db.String(100), default="zero-shot")
    
   
    temperature = db.Column(db.Float, default=0.7)
    max_tokens = db.Column(db.Integer, default=1024)
    top_p = db.Column(db.Float, default=1.0)
    
   
    version = db.Column(db.Integer, default=1)
    parent_id = db.Column(db.Integer, db.ForeignKey('prompts.id'), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'system_prompt': self.system_prompt,
            'user_prompt': self.user_prompt,
            'category': self.category,
            'tags': self.tags.split(',') if self.tags else [],
            'technique': self.technique,
            'temperature': self.temperature,
            'max_tokens': self.max_tokens,
            'top_p': self.top_p,
            'version': self.version,
            'created_at': self.created_at.isoformat()
        }



class History(db.Model):
    __tablename__ = 'history'
    
    id = db.Column(db.Integer, primary_key=True)
    system_prompt = db.Column(db.Text, default="")
    user_prompt = db.Column(db.Text, nullable=False)
    output = db.Column(db.Text, default="")
    technique = db.Column(db.String(100), default="zero-shot")
    
    
    temperature = db.Column(db.Float, default=0.7)
    max_tokens = db.Column(db.Integer, default=1024)
    top_p = db.Column(db.Float, default=1.0)
    
  
    response_time = db.Column(db.Float, default=0.0)  
    input_tokens = db.Column(db.Integer, default=0)
    output_tokens = db.Column(db.Integer, default=0)
    
  
    rating = db.Column(db.Integer, nullable=True)  
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'system_prompt': self.system_prompt,
            'user_prompt': self.user_prompt,
            'output': self.output,
            'technique': self.technique,
            'temperature': self.temperature,
            'max_tokens': self.max_tokens,
            'top_p': self.top_p,
            'response_time': self.response_time,
            'input_tokens': self.input_tokens,
            'output_tokens': self.output_tokens,
            'rating': self.rating,
            'created_at': self.created_at.isoformat()
        }


def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("Database tables created!")