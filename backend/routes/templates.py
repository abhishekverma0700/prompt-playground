from flask import Blueprint, jsonify
import json
import os

templates_bp = Blueprint('templates', __name__)
def load_templates():
    try:
        # File ka path
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        templates_path = os.path.join(base_dir, 'data', 'templates.json')
        
        with open(templates_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Templates load error: {e}")
        return []

@templates_bp.route('/api/templates', methods=['GET'])
def get_templates():
    templates = load_templates()
    return jsonify({
        'success': True,
        'templates': templates,
        'total': len(templates)
    })


@templates_bp.route('/api/templates/<int:template_id>', methods=['GET'])
def get_template(template_id):
    templates = load_templates()
    
    template = next(
        (t for t in templates if t['id'] == template_id), 
        None
    )
    
    if not template:
        return jsonify({
            'success': False,
            'error': 'Template not found'
        }), 404
    
    return jsonify({
        'success': True,
        'template': template
    })