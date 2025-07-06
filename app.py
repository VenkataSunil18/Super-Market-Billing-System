from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

products = {
    "cola": 40,
    "chips": 10,
    "biscuits": 20,
    "chocolate": 50,
    "maggie": 15,
    "juice": 35,
    "cookies": 25,
    "milk": 30,
    "soda": 20,
    "candy": 5
}

def get_discount(amount):
    if amount > 5000: return 0.20
    elif amount > 1000: return 0.15
    elif amount > 500: return 0.07
    else: return 0.05

@app.route('/calculate', methods=['POST'])
def calculate_bill():
    data = request.json
    cart = data['cart']
    amount = sum(float(item['quantity']) * products[item['name']] for item in cart)
    discount = get_discount(amount)
    final_amount = amount - (amount * discount)
    
    response = {
        "amount": amount,
        "discount": discount,
        "final_amount": final_amount
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
