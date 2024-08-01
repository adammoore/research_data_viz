# app.py
# Flask application for the research data lifecycle visualization

from flask import Flask, render_template, jsonify, request
import json

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

# API Endpoint to retrieve data
@app.route('/api/data', methods=['GET'])
def get_data():
    data = load_json('data.json')
    return jsonify(data)

# API Endpoint to create new data
@app.route('/api/data', methods=['POST'])
def create_data():
    new_data = request.json
    data = load_json('data.json')
    data.update(new_data)
    save_json('data.json', data)
    return jsonify(data), 201

# API Endpoint to update existing data
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

if __name__ == '__main__':
    app.run(debug=True)

