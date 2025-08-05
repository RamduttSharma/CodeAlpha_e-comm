function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return alert("Please fill all fields");

    fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                alert("Login successful!");
                window.location.href = "index.html";
            } else {
                alert(data.msg || "Login failed");
            }
        })
        .catch(() => alert("Login error"));
}

document.addEventListener("DOMContentLoaded", updateCartCount);

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    document.getElementById("cart-count").textContent = cart.length;
}
