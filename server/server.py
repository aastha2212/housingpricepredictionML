from flask import Flask, request, jsonify, send_from_directory
import util
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
STATIC_DIR = os.path.join(BASE_DIR, 'client')

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='')

@app.before_first_request
def _load_artifacts_once():
    try:
        print("[startup] Loading ML artifacts...")
        util.load_saved_artifacts()
        print("[startup] ML artifacts loaded.")
    except Exception as e:
        # Print so it shows in EB web logs
        print(f"[startup] Failed to load artifacts: {e}")

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    total_sqft = float(request.form['total_sqft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(location,total_sqft,bhk,bath)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'app.html')

@app.route('/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(host='0.0.0.0', port=5000, debug=False)
