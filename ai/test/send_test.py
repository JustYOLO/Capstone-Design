from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/save_recommendation", methods=["POST"])
def save_recommendation():
    data = request.get_json()
    print(f"받은 데이터: {data}")
    return jsonify({"status": "success", "received": data}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)