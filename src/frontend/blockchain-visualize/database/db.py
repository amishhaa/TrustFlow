from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017/")  # Local MongoDB (later will to change Atlas)
db = client["acidtrace"] 

customer_collection = db["customer_transactions"]
blockchain_collection = db["blockchain_transactions"]


def save_customer_transaction(transaction_id, date,time,customer_name,acid_type):
    customer_collection.insert_one({
        "transaction_id": transaction_id,
        "date": date,
        "time": time,
        "customer_name": customer_name,
        "acid_type": acid_type
    })

def save_source(source_code, amount):
    blockchain_collection.insert_one({
        "type": "source",
        "source_code": source_code,
        "amount": amount
    })


def save_transaction(vendor_code, source_code, amount, leaf=False):
    blockchain_collection.insert_one({
        "type": "transaction",
        "vendor_code": vendor_code,
        "source_code": source_code,
        "amount": amount,
        "leaf": leaf
    })


def get_all_customers():
    return list(customer_collection.find({}, {"_id": 0}))


def get_all_transactions():
    return list(blockchain_collection.find({}, {"_id": 0}))


def get_latest_customer():
    return customer_collection.find_one({}, {"_id": 0}, sort=[("_id", -1)])

def get_latest_blockchain():
    return blockchain_collection.find_one({}, {"_id": 0}, sort=[("_id", -1)])


#For testing
save_source(1234, 100)
save_transaction(1234, 1243, 10)


# Insert a customer transaction
save_customer_transaction(
    "TXN-0990",
    "08-03-2024",
    "23:47:08",
    "Customer-01890",
    "Hydrochloric Acid"
)


# Fetch everything back
# print("All transactions in DB:")
# for doc in get_all_transactions():
#     print(doc)

#get latest customer details from db
latest_customer = get_latest_customer()
print(f"Latest Customer details: {latest_customer}")

#get latest blockchain details from db
latest_transaction = get_latest_blockchain()
print(f"Latest Transaction details: {latest_transaction}")