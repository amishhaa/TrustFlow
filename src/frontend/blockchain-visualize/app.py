from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain.block import TransactionGroup
from database import db

app = Flask(__name__)
CORS(app)

group = TransactionGroup()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to AcidTrace Blockchain API!"})

@app.route('/create-source', methods=['POST'])
def create_source():
    try:
        data = request.get_json()
        source_code = int(data['source_code'])
        amount = int(data['amount'])

        group.create_source(source_code, amount)
        db.save_source(source_code, amount)

        return jsonify({"message": "Source Created ✅"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/create-transaction', methods=['POST'])
def create_transaction():
    try:
        data = request.get_json()
        vendor_code = int(data['vendor_code'])
        source_code = int(data['source_code'])
        amount = int(data['amount'])
        leaf = bool(data.get('leaf', False))

        group.create_transaction(vendor_code, source_code, amount, leaf)
        db.save_transaction(vendor_code, source_code, amount, leaf)

        return jsonify({"message": "Transaction Recorded ✅"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/get-chain', methods=['GET'])
def get_chain():
    try:
        structure = {k: list(v) for k, v in group.structure.items()}
        balances = dict(group.sources)
        blocks = {
            k: {"amount": v.amount, "hash": v.hash}
            for k, v in group.block.items()
        }
        all_tx = db.get_all_transactions()

        return jsonify({
            "structure": structure,
            "balances": balances,
            "blocks": blocks,
            "transactions": all_tx
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/balance', methods=['GET'])
def check_balance():
    return jsonify({"status": group.balance()}), 200

if __name__ == '__main__':
    app.run(debug=True)
