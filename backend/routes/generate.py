from flask import Blueprint, request, jsonify
from services.llm_service import llm_service
from models.database import db, History

generate_bp = Blueprint('generate', __name__)


@generate_bp.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    
   
    if not data or not data.get('user_prompt'):
        return jsonify({'success': False, 'error': 'user_prompt is required'}), 400
    
   
    user_prompt = data.get('user_prompt', '')
    system_prompt = data.get('system_prompt', '')
    temperature = float(data.get('temperature', 0.7))
    max_tokens = int(data.get('max_tokens', 1024))
    top_p = float(data.get('top_p', 1.0))
    technique = data.get('technique', 'zero-shot')
    stop = data.get('stop', None)
 
    result = llm_service.generate(
        user_prompt=user_prompt,
        system_prompt=system_prompt,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=top_p,
        stop=stop
    )
    
    
    if result['success']:
        history_entry = History(
            user_prompt=user_prompt,
            system_prompt=system_prompt,
            output=result['output'],
            technique=technique,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            response_time=result['response_time'],
            input_tokens=result['input_tokens'],
            output_tokens=result['output_tokens']
        )
        db.session.add(history_entry)
        db.session.commit()
        result['history_id'] = history_entry.id
    
    return jsonify(result)



@generate_bp.route('/api/compare', methods=['POST'])
def compare():
    data = request.get_json()
    
    
    if not data or not data.get('prompt_a') or not data.get('prompt_b'):
        return jsonify({'success': False, 'error': 'prompt_a and prompt_b are required'}), 400
    
    prompt_a = data.get('prompt_a')
    prompt_b = data.get('prompt_b')
    
    params_a = {
        'user_prompt': prompt_a.get('user_prompt', ''),
        'system_prompt': prompt_a.get('system_prompt', ''),
        'temperature': float(prompt_a.get('temperature', 0.7)),
        'max_tokens': int(prompt_a.get('max_tokens', 1024)),
        'top_p': float(prompt_a.get('top_p', 1.0)),
    }
    
    
    params_b = {
        'user_prompt': prompt_b.get('user_prompt', ''),
        'system_prompt': prompt_b.get('system_prompt', ''),
        'temperature': float(prompt_b.get('temperature', 0.7)),
        'max_tokens': int(prompt_b.get('max_tokens', 1024)),
        'top_p': float(prompt_b.get('top_p', 1.0)),
    }
    
    result_a = llm_service.generate(**params_a)
    result_b = llm_service.generate(**params_b)
    
    return jsonify({
        'success': True,
        'result_a': result_a,
        'result_b': result_b
    })

@generate_bp.route('/api/sweep', methods=['POST'])
def sweep():
    data = request.get_json()
    
    if not data or not data.get('user_prompt'):
        return jsonify({'success': False, 'error': 'user_prompt is required'}), 400
    
    user_prompt = data.get('user_prompt', '')
    system_prompt = data.get('system_prompt', '')
    max_tokens = int(data.get('max_tokens', 1024))
    
    sweep_param = data.get('sweep_param', 'temperature')
    sweep_values = data.get('sweep_values', [0.0, 0.3, 0.7, 1.0, 1.5])
    
    results = []
    
    for value in sweep_values:
        if sweep_param == 'temperature':
            result = llm_service.generate(
                user_prompt=user_prompt,
                system_prompt=system_prompt,
                temperature=float(value),
                max_tokens=max_tokens,
            )
        elif sweep_param == 'top_p':
            result = llm_service.generate(
                user_prompt=user_prompt,
                system_prompt=system_prompt,
                top_p=float(value),
                max_tokens=max_tokens,
            )
        
        results.append({
            'param_value': value,
            'sweep_param': sweep_param,
            'result': result
        })
    
    return jsonify({
        'success': True,
        'sweep_param': sweep_param,
        'results': results
    })