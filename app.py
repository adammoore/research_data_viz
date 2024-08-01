# app.py
# Main Flask application for research data visualization

from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
