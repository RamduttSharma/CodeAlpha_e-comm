function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) return alert("Please fill all fields");

    fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.msg) {
                alert(data.msg);
                window.location.href = "login.html";
            } else {
                alert("Registration failed");
            }
        })
        .catch(() => alert("Error registering user"));
}

document.addEventListener("DOMContentLoaded", updateCartCount);

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    document.getElementById("cart-count").textContent = cart.length;
}
