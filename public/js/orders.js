document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return location.href = "login.html";

    fetch("/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` } // ✅ fix here

    })
        .then(res => res.json())
        .then(orders => {
            const list = document.getElementById("orders-list");

            if (!orders || orders.length === 0) {
                list.innerHTML = "<p>No orders yet.</p>";
                return;
            }

            orders.forEach(order => {
                const div = document.createElement("div");
                const date = new Date(order.createdAt).toLocaleString();

                // ✅ Updated total using populated product data
                const total = order.items.reduce((sum, i) => {
                    return sum + (i.price || 0) * (i.qty || 0);
                }, 0);


                div.innerHTML = `
                <p><strong>Order Date:</strong> ${date}</p>
                <p><strong>Total:</strong> ₹${total}</p>
                <p><strong>Items:</strong></p>
                <ul>
                    ${order.items.map(i => {
                    const name = i.name || i.productId?.name || "Unknown";
                    const price = i.price || i.productId?.price || 0;
                    const image = i.images || i.productId?.image || "images/no-image.png";
                    const desc = i.description || i.productId?.description || "";
                    const qty = i.qty || 0;

                    return `
        <li style="margin-bottom: 10px;">
            <img src="${image}" width="60" style="vertical-align: middle; margin-right: 10px;">
            <strong>${name}</strong><br>
            <em>${desc}</em><br>
            Qty: ${qty}, Price: ₹${price}, Total: ₹${price * qty}
        </li>
    `;
                }).join("")}

                </ul>
                <hr>
            `;

                list.appendChild(div);
            });
        })
        .catch(err => {
            console.error("Failed to load orders:", err);
        });

    updateCartCount();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    document.getElementById("cart-count").textContent = cart.length;
}

function logout() {
    localStorage.clear();
    alert("Logged out successfully.");
    location.href = "index.html";
}
