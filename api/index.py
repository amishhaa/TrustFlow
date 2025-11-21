from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask on Vercel with HTTPS!"})

def handler(event, context):
    return app(event, context)
