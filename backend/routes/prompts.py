from flask import Blueprint,request,jsonify
from models.database import db, Prompt
prompts_bp =Blueprint('prompt',__name__)

@prompts_bp.route('/api/prompts', methods=['GET'])
def get_prompts():
    search=request.args.get('search','')
    category=request.args.get('category','')

    query=Prompt.query
    if search:
        query=query.filter(
            Prompt.name.contains(search)|
            Prompt.description.contains(search)|
            Prompt.tags.contains(search)
        )
    if category:
        query=query.filter(Prompt.category ==category)
    prompts=query.order_by(Prompt.created_at.desc()).all()

    return jsonify({
        'success':True,
        'prompts':[p.to_dict() for p in prompts],
        'total':len(prompts)
    })
@prompts_bp.route('/api/prompts', methods=['POST'])
def save_prompt():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('user_prompt'):
        return jsonify({'success': False, 'error': 'name and user_prompt are required'}), 400
    
    
    tags = data.get('tags', [])
    if isinstance(tags, list):
        tags = ','.join(tags)
    
    
    new_prompt = Prompt(
        name=data.get('name'),
        description=data.get('description', ''),
        system_prompt=data.get('system_prompt', ''),
        user_prompt=data.get('user_prompt'),
        category=data.get('category', 'General'),
        tags=tags,
        technique=data.get('technique', 'zero-shot'),
        temperature=float(data.get('temperature', 0.7)),
        max_tokens=int(data.get('max_tokens', 1024)),
        top_p=float(data.get('top_p', 1.0)),
        version=1
    )
    
    db.session.add(new_prompt)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Prompt saved successfully!',
        'prompt': new_prompt.to_dict()
    }), 201
@prompts_bp.route('/api/prompts/<int:prompt_id>',methods=['PUT'])
def update_prompt(prompt_id):
    prompt=Prompt.query.get_or_404(prompt_id)
    data=request.get_json()

    tags=data.get('tags',[])
    if isinstance(tags,list):
        tags=','.join(tags)
    new_version=prompt(
        name=data.get('name',prompt.name),
        description=data.get('description',prompt.description),
        system_prompt=data.get('system_prompt',prompt.system_prompt),
        user_prompt=data.get('user_prompt',prompt.user_prompt),
        category=data.get('category',prompt.category),
        tags=tags if tags else prompt.tags,
        technique=data.get('technique',prompt.technique),
        temperature=float(data.get('max_tokens',prompt.max_tokens)),
        top_p=float(data.get('top_p',prompt.top_p)),
        version=prompt.version+1,
        parent_id=prompt_id
    )
    db.session.add(new_version)
    db.sesion.commit()

    return jsonify({
        'success':True,
        'message':'Prompt updated successfully',
        'prompt':new_version.to_dict()

    })

@prompts_bp.route('/api/prompts/<int:prompt_id>',methods=['DELETE'])
def delete_prompt(prompt_id):
    prompt=Prompt.query.get_or_404(prompt_id)
    db.session.delete(prompt)
    db.session.commit()

    return jsonify({
        'success':True,
        'message':'Prompt deleted successfully'
    })

@prompts_bp.route('/api/export',methods=['GET'])
def export_prompts():
    prompts=Prompt.query.all()
    return jsonify({
        'success':True,
        'prompts':[p.to_dict() for p in prompts]
    })

@prompts_bp.route('/api/import',methods=['POST'])
def import_prompts():
    data=request.get_json()
    prompts_data=data.get('prompts',[])
    imported=0
    for p in prompts_data:
        tags=p.get('tags',[])
        if isinstance(tags,list):
            tags=','.join(tags)
        prompt=prompt(
            name=p.get('name','Imported Prompt'),
            description=p.get('description',''),
            system_prompt=p.get('system_prompt',''),
            user_prompt=p.get('user_prompt',''),
            category=p.get('category','General'),
            tags=tags,
            technique=p.get('technique','zero-shot'),
            temperature=float(p.get('temperature',0.7)),
            max_tokens=int(p.get('max_tokens',1024)),
            top_p=float(p.get('top_p',1.0)),
        )
        db.session.add(prompt)
        imported +=1
    db.session.commit()
    return jsonify({
        'success': True,
        'message': f'{imported} prompts imported successfully'

    })