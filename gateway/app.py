from flask import Flask, request, jsonify
import requests

RASA_REST_WEBHOOK = "http://rasa:5005/webhooks/rest/webhook"
app = Flask(__name__)

@app.route("/webhook/<tenant>", methods=["POST"])
def rasa_gateway(tenant):
    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({
            "error": "Invalid JSON payload",
            "detail": str(e),
            "raw": request.get_data(as_text=True)
        }), 400

    sender_id = data.get("sender")
    message = data.get("message")
    if not sender_id or not message:
        return jsonify({"error": "Missing 'sender' or 'message'"}), 400

    rewritten_sender = f"{tenant}__{sender_id}"
    payload = {"sender": rewritten_sender, "message": message}
    try:
        response = requests.post(RASA_REST_WEBHOOK, json=payload, timeout=10)
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
