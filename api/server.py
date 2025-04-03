from flask import Flask, jsonify, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS
import subprocess
import json
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
@app.route("/")
def index():
    return "Flask-SocketIO está rodando!"

@app.route("/api/data/marvel_movies.json", methods=["GET"])
def get_json_data():
    try:
        return send_from_directory(DATA_DIR, "marvel_movies.json")
    except Exception:
        return jsonify({"error": "Arquivo JSON não encontrado"}), 404
    
@app.route("/run-script", methods=["POST"])
def run_script():
    try:
        result = subprocess.run(["python", "scrapping.py"], capture_output=True, text=True)
        
        json_file = os.path.join(os.path.dirname(__file__), "data", "marvel_movies.json")

        
        if os.path.exists(json_file):
            with open(json_file, "r") as f:
                updated_data = json.load(f)
            
            print("Emitindo evento data_updated...") 
            socketio.emit("data_updated", updated_data)
            print("Evento emitido com sucesso!")  

        return jsonify({"output": result.stdout, "error": result.stderr})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=3001, debug=True)
