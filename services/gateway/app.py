
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
RASA_URL = "http://rasa:5005/webhooks/rest/webhook"

@app.route('/chat/<tenant>/<user>', methods=['POST'])
def chat(tenant, user):
    payload = request.json
    sender = f"{tenant}__{user}"
    data = {"sender": sender, "message": payload["message"]}
    response = requests.post(RASA_URL, json=data)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
