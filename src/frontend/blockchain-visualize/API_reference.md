#  AcidTrace API Reference

This document outlines all available API endpoints for the AcidTrace blockchain system. The backend is built using Flask, and this reference is meant for frontend developer.


---

# Base URL (Local Development)

http://localhost:5000

📌 API Endpoints

🚩 1. POST `/create-source`

Purpose: Add a new acid source to the system.

Request Body:
json
{
  "source_code": 1234,
  "amount": 100
}
Response:

json
{
  "message": "Source created successfully.",
  "source_code": 1234,
  "amount": 100
}

🚩 2.POST /create-transaction
Purpose: Transfer acid from one vendor/source to another.

Request Body:

json
{
  "vendor_code": 1234,
  "source_code": 1243,
  "amount": 50,
  "leaf": false
}
leaf is optional. Use true only if it’s the final destination (e.g. disposal).

Response:

json
{
  "message": "Transaction recorded successfully.",
  "from": 1234,
  "to": 1243,
  "amount": 50,
  "leaf": false
}

🚩3. GET /balance
Purpose: Check if all acid has been fully tracked (no loss or extra).

Response:

json
{
  "status": "Balanced"
}
or

json
{
  "status": "Anamoly"
}

🚩4. GET /get-chain
Purpose: View the current blockchain structure for debugging or visualization.

Response:

json

{
  "structure": {
    "1234": ["1243", "13"],
    "1243": ["14"]
  },
  "sources": {
    "1234": 0,
    "1243": 0,
    "13": 0,
    "14": 0
  },
  "blocks": {
    "1234": {
      "amount": 100,
      "hash": "..."
    },
    ...
  }
}

