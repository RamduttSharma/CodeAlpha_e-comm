document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("viewProductId");

    if (!id) {
        alert("Product not found");
        location.href = "index.html";
        return;
    }

    fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(product => {
            const box = document.getElementById("product-container");

            box.innerHTML = `
                <img src="${product.images}" alt="${product.name}" width="200">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <h3>Price: ₹${product.price}</h3>
                <label>Quantity: </label>
                <select id="qty">
                    ${[1, 2, 3, 4, 5].map(i => `<option value="${i}">${i}</option>`).join("")}
                </select>
                <br>
                <button onclick="addToCartAndGo('${product._id}', ${product.price}, '${product.name}', '${product.image}')">Add to Cart</button>
                <button onclick="location.href='index.html'">Back to Home</button>
            `;
        });

    updateCartCount();
});

function addToCartAndGo(productId, price, name, image) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to add items to cart.");
        return location.href = "login.html";
    }

    const qty = parseInt(document.getElementById("qty").value);
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ productId, qty, price, name, images: image });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
    window.location.href = "cart.html";
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    document.getElementById("cart-count").textContent = cart.length;
}

function logout() {
    localStorage.clear();
    alert("Logged out");
    location.href = "index.html";
}
