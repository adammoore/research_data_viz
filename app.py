from flask import Flask, render_template, jsonify, request
import json
from layout_calculator import calculate_positions, linear_positions

app = Flask(__name__)

# Utility function to load JSON data
def load_json(file_name):
    with open(f'static/data/{file_name}', 'r') as file:
        return json.load(file)

# Utility function to save JSON data
def save_json(file_name, data):
    with open(f'static/data/{file_name}', 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/')
def index():
    layout = load_json('layout.json')
    data = load_json('data.json')
    return render_template('index.html', layout=layout, data=data)

@app.route('/api/layout/<view_mode>', methods=['GET'])
def get_layout(view_mode):
    layout = load_json('layout.json')
    
    if view_mode == 'circular':
        layout = calculate_positions(layout)
    elif view_mode == 'linear':
        layout = linear_positions(layout)

    return jsonify(layout)

# API Endpoint to retrieve data
@app.route('/api/data', methods=['GET'])
def get_data():
    data = load_json('data.json')
    return jsonify(data)

# API Endpoint to create new data (e.g., add a new stage or category)
@app.route('/api/data', methods=['POST'])
def create_data():
    new_data = request.json
    data = load_json('data.json')
    data.update(new_data)
    save_json('data.json', data)
    return jsonify(data), 201

# API Endpoint to update existing data (e.g., update a stage or category)
@app.route('/api/data/<stage>', methods=['PUT'])
def update_data(stage):
    updated_data = request.json
    data = load_json('data.json')
    data[stage] = updated_data
    save_json('data.json', data)
    return jsonify(data)

# API Endpoint to delete a category or example
@app.route('/api/data/<stage>/<category>', methods=['DELETE'])
def delete_data(stage, category):
    data = load_json('data.json')
    data[stage]['tool_category_type'] = [
        cat for cat in data[stage]['tool_category_type'] if cat['category'] != category
    ]
    save_json('data.json', data)
    return jsonify(data)

# API Endpoint to create a new exemplar within a specific category
@app.route('/api/exemplar', methods=['POST'])
def create_exemplar():
    content = request.json
    category_name = content['categoryName']
    new_exemplar = content['newExemplar']

    # Load the current data
    data = load_json('data.json')

    # Locate the correct category and append the new exemplar
    for stage, details in data.items():
        for category in details['tool_category_type']:
            if category['category'] == category_name:
                category['examples'].append(new_exemplar)
                save_json('data.json', data)
                return jsonify({"message": "Exemplar added", "category": category}), 201
    
    return jsonify({"message": "Category not found"}), 404

# API Endpoint to delete an exemplar within a specific category
@app.route('/api/exemplar/<category_name>/<exemplar_name>', methods=['DELETE'])
def delete_exemplar(category_name, exemplar_name):
    # Load the current data
    data = load_json('data.json')

    # Locate the correct category and remove the exemplar
    for stage, details in data.items():
        for category in details['tool_category_type']:
            if category['category'] == category_name:
                if exemplar_name in category['examples']:
                    category['examples'].remove(exemplar_name)
                    save_json('data.json', data)
                    return jsonify({"message": "Exemplar deleted", "category": category}), 200
                return jsonify({"message": "Exemplar not found"}), 404
    
    return jsonify({"message": "Category not found"}), 404

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

