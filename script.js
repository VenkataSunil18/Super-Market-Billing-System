const products = {
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
};

document.getElementById("billingForm").onsubmit = async function(event) {
    event.preventDefault();  // Prevent default form submission

    const name = document.getElementById("name").value;
    const ph_no = document.getElementById("ph_no").value;
    const productList = document.querySelectorAll("#productList .product-item");
    const cart = [];  // Initialize an empty cart array

    // Collect product data from the form
    productList.forEach(item => {
        const pname = item.querySelector(".product-name").value;
        const quantity = parseFloat(item.querySelector(".product-quantity").value);
        cart.push({ name: pname, quantity: quantity });
    });

    // Send data to the backend and wait for the response
    const response = await fetch('http://127.0.0.1:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart })
    });

    const data = await response.json();

    // Display the calculated bill
    let billOutput = `Customer Name: ${name}\nPhone Number: ${ph_no}\n\n`;
    cart.forEach(item => {
        billOutput += `${item.name}: ${products[item.name]} x ${item.quantity}\n`;
    });
    billOutput += `Total Bill: ${data.amount}\nDiscount Applied: ${data.discount * 100}% OFF\nFinal Amount: ${data.final_amount}`;

    document.getElementById("billOutput").innerText = billOutput;  // Output the result
};

// Function to add product input fields dynamically
function addProduct() {
    const productList = document.getElementById("productList");
    const productItem = document.createElement("div");
    productItem.className = "product-item";

    productItem.innerHTML = `
        <label>Product Name:</label>
        <input type="text" class="product-name" onclick="showProductList(this)" required autocomplete="off">
        <div class="product-suggestions" style="display:none;"></div>
        <label>Quantity:</label>
        <input type="number" class="product-quantity" required min="1"><br><br>
    `;
    productList.appendChild(productItem);  // Append the new product item to the list
}

// Function to show the list of all products when clicked
function showProductList(input) {
    const suggestionsDiv = input.parentElement.querySelector('.product-suggestions');
    
    // Clear existing suggestions
    suggestionsDiv.innerHTML = '';

    // Show suggestions for all products
    Object.keys(products).forEach(product => {
        const suggestionItem = document.createElement("div");
        suggestionItem.textContent = product;
        suggestionItem.onclick = () => {
            input.value = product; // Set the input value to selected product
            suggestionsDiv.innerHTML = '';  // Clear suggestions after selection
            suggestionsDiv.style.display = 'none'; // Hide the suggestions
        };
        suggestionsDiv.appendChild(suggestionItem);
    });

    suggestionsDiv.style.display = 'block'; // Display the suggestions list
}

// To hide the suggestions when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.matches('.product-name')) {
        const allSuggestions = document.querySelectorAll('.product-suggestions');
        allSuggestions.forEach(suggestionDiv => {
            suggestionDiv.style.display = 'none';
        });
    }
});
