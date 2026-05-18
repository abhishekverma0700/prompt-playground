from flask import Blueprint, request, jsonify
from models.database import db, History

history_bp = Blueprint('history', __name__)

@history_bp.route('/api/history', methods=['GET'])
def get_history():
    
    technique = request.args.get('technique', '')
    limit = int(request.args.get('limit', 50))
    
    query = History.query
    
    if technique:
        query = query.filter(History.technique == technique)
    
    history = query.order_by(History.created_at.desc()).limit(limit).all()
    
    return jsonify({
        'success': True,
        'history': [h.to_dict() for h in history],
        'total': len(history)
    })
@history_bp.route('/api/history/<int:history_id>', methods=['GET'])
def get_history_entry(history_id):
    entry = History.query.get_or_404(history_id)
    return jsonify({
        'success': True,
        'entry': entry.to_dict()
    })
@history_bp.route('/api/history/<int:history_id>/rate', methods=['PUT'])
def rate_history(history_id):
    entry = History.query.get_or_404(history_id)
    data = request.get_json()
    
    rating = data.get('rating')
    
    
    if not rating or int(rating) < 1 or int(rating) > 5:
        return jsonify({
            'success': False, 
            'error': 'Rating must be between 1 and 5'
        }), 400
    
    entry.rating = int(rating)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Rating saved!',
        'entry': entry.to_dict()
    })
@history_bp.route('/api/history', methods=['DELETE'])
def clear_history():
    History.query.delete()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'History cleared!'
    })
@history_bp.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'status': 'Server is running!',
        'message': 'Prompt Playground Backend Ready 🚀'
    })