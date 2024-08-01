# Research Data Lifecycle Visualization

This project visualizes the MaLDReTH Research Data Lifecycle using Flask and D3.js. It includes features for viewing and managing research tools across different lifecycle stages.

## Features
- **Interactive Visualization**: Displays the research data lifecycle stages with connections between them.
- **Dynamic Data Loading**: Data for each stage and tool is loaded from JSON files.
- **CRUD API Endpoints**: Manage tool categories and examples via RESTful API endpoints.
- **JSON-Based Layout**: Layout and data are managed through JSON files, allowing easy updates and extensions.

## Project Structure
- `app.py`: Main Flask application.
- `static/css/styles.css`: Styling for the application.
- `static/js/visualization.js`: JavaScript with D3.js for rendering the visualization.
- `static/data/layout.json`: JSON file defining the stages and connections.
- `static/data/data.json`: JSON file containing data for tool categories and examples.
- `templates/index.html`: HTML template for the main page.
- `requirements.txt`: Python dependencies.
- `LICENSE`: Apache 2.0 License.
- `.gitignore`: Git ignore file.

## CRUD API Endpoints

- **GET /api/data**: Retrieve the current data.
- **POST /api/data**: Create new tool data.
  - Request Body: JSON containing the new tool data.
- **PUT /api/data/<stage>**: Update existing data for a specific stage.
  - Request Body: JSON with updated data.
- **DELETE /api/data/<stage>/<category>**: Delete a specific tool category from a stage.

## JSON Structure

### `layout.json`
```json
{
    "stages": [
        {
            "name": "Conceptualise",
            "x": 200,
            "y": 100,
            "next": "Plan"
        },
        ...
    ],
    "connections": [
        { "from": "Conceptualise", "to": "Plan" },
        ...
    ]
}

### `data.json`
```json
{
    "Conceptualise": {
        "tool_category_type": [
            {
                "category": "Mind mapping, concept mapping and knowledge modelling",
                "examples": ["Miro", "Meister Labs", "XMind"]
            },
            ...
        ]
    },
    ...
}
```

### 5. Running the Application
Clone the repository.
Install the dependencies using pip install -r requirements.txt.
Run the application using python app.py.
Access the application at http://127.0.0.1:5000/.
Testing API Endpoints
Use tools like Postman or curl to interact with the API endpoints.

### 6. License
This project is licensed under the Apache 2.0 License. See the LICENSE file for details.


### 7. Final Touches: `.gitignore` and `LICENSE`

**`.gitignore`**:
The `.gitignore` file will exclude common files and directories that should not be included in version control, such as Python cache files, virtual environments, and deployment artifacts.

```plaintext
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Distribution / packaging
.Python
env/
build/
dist/

# Flask specific
instance/
.webassets-cache

# PyCharm specific
.idea/

