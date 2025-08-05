document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return location.href = "login.html";

    updateCartCount();
    loadCart();
});

function loadCart() {
    const container = document.getElementById("cart-container");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    container.innerHTML = "";

    let grandTotal = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <p>Your cart is empty.</p>
            <button onclick="continueShopping()" class="blue-btn">Continue Shopping</button>
        `;
        return;
    }

    cart.forEach((item, index) => {
        const total = item.price * item.qty;
        grandTotal += total;

        const card = document.createElement("div");
        card.className = "cart-item";
        card.innerHTML = `
            <img src="${item.images}" alt="${item.name}" style="width: 100px;"><br>
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>
            <label>Quantity:
                <select onchange="updateQuantity(${index}, this.value)">
                    ${[1, 2, 3, 4, 5].map(q =>
                        `<option value="${q}" ${item.qty === q ? "selected" : ""}>${q}</option>`
                    ).join("")}
                </select>
            </label>
            <p><strong>Total: ₹${item.price * item.qty}</strong></p>
            <button onclick="placeSingleOrder(${index})">Place Order</button>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(card);
    });

    const summary = document.createElement("div");
    summary.innerHTML = `
        <h3>Grand Total: ₹${grandTotal}</h3>
        <button onclick="placeOrder()" class="blue-btn">Place All Orders</button>
        <button onclick="continueShopping()" class="blue-btn">Continue Shopping</button>
    `;
    container.appendChild(summary);
}





function updateCartCount() {
    const token = localStorage.getItem("token");
    const cartCountElem = document.getElementById("cart-count");

    if (!token || !cartCountElem) {
        if (cartCountElem) cartCountElem.textContent = "0";
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElem.textContent = totalQty;
}



function logout() {
    localStorage.clear();
    alert("Logged out");
    location.href = "index.html";
}

function addToCart(productId, price, name, image) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to add items to your cart.");
        return;
    }

    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = parseInt(qtyInput?.value);

    if (!qty || qty < 1) {
        alert("Please select a valid quantity.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ productId, qty, price, name, images: image, description });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
}



function placeOrder() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!Array.isArray(cart) || cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const validatedItems = cart.map(item => ({
    productId: item.productId,
    name: item.name || "Unnamed",
    price: Number(item.price),
    qty: Number(item.qty),
    images: item.images || "images/no-image.png",
    description: item.description || ""   // ✅ include this
}));


    fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`

        },
        body: JSON.stringify({ items: validatedItems })
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            console.error("❌ Server error:", data);
            return alert("Order failed: " + (data.msg || "Unknown error"));
        }

        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        updateCartCount();
        window.location.href = "orders.html";
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Network error while placing order.");
    });
}





function placeSingleOrder(index) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in");

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = cart[index];

    if (!item) {
        alert("Item not found in cart.");
        return;
    }

    // ✅ Ensure single validated item object
    const validatedItem = {
        productId: item.productId,
        name: item.name || "Unnamed",
        price: Number(item.price),
        qty: parseInt(item.qty) || 1,
        images: item.images || "images/no-image.png",
        description: item.description || ""
    };

    console.log("🧾 Validated single item:", validatedItem);  // ✅ Logs ONE object

    fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: [validatedItem] })  // ✅ Send single item in array
    })
        .then(async res => {
            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Server error:", data);
                alert("❌ Failed to place order: " + (data.msg || "Unknown error"));
                return;
            }

            alert("✅ Order placed for 1 item!");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            loadCart();
        })
        .catch(() => {
            alert("⚠️ Error placing order. Try again.");
        });
}




function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart[index].qty = parseInt(newQty);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCart();
}


function continueShopping() {
    window.location.href = "index.html";
}
