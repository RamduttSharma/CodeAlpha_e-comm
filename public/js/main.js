document.addEventListener("DOMContentLoaded", () => {
    updateHeader();
    loadProducts();
    const cartLink = document.getElementById("cart-link");

    if (cartLink) {
        cartLink.addEventListener("click", function (e) {
            e.preventDefault(); // Prevents link navigation
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to access your cart.");
            } else {
                window.location.href = "cart.html";
            }
        });
    }
});

function updateHeader() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    document.getElementById("cart-count").textContent =
        (JSON.parse(localStorage.getItem("cart") || "[]")).length;

    if (token && user) {
        document.getElementById("login-link").style.display = "none";
        document.getElementById("profile-link").style.display = "inline";
        document.getElementById("orders-link").style.display = "inline";
        document.getElementById("logout-link").style.display = "inline";
    }
}

function logout() {
    localStorage.clear();
    alert("Logged out");
    window.location.href = "index.html";
}

function loadProducts() {
    fetch("/api/products")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("product-container");
            container.innerHTML = "";

            data.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <img src="${p.images}" alt="${p.name}" style="width: 150px;">
                    <h3>${p.name}</h3>
                    <p>₹${p.price}</p>
                    <select id="qty-${p._id}">
                        ${[1, 2, 3, 4, 5].map(i => `<option value="${i}">${i}</option>`).join("")}
                    </select>
                    <button onclick="addToCart('${p._id}', ${p.price}, '${p.name}', '${p.images}')">Add to Cart</button>
                    <button onclick="viewProduct('${p._id}')">View Product</button>
                `;
                container.appendChild(card);
            });
        });
}





function addToCart(productId, price, name, images) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to add items to your cart.");
        return;
    }

    const qty = parseInt(document.getElementById(`qty-${productId}`).value);
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ productId, qty, price, name, images });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
}


function updateCartCount() {
    const token = localStorage.getItem("token");
    const cartCountElem = document.getElementById("cart-count");
    
    if (!token) {
        cartCountElem.textContent = "0";
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.qty;
    });

    cartCountElem.textContent = totalItems;
}


function viewProduct(id) {
    localStorage.setItem("viewProductId", id);
    window.location.href = "product.html";
}
