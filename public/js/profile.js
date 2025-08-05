document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return location.href = "login.html";

    fetch("/api/profile", {
        Authorization: `Bearer ${token}` // ✅ fix here too

    })
        .then(res => res.json())
        .then(user => {
            document.getElementById("profile-info").innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      `;
        });

    updateCartCount();
});

function updatePassword() {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const token = localStorage.getItem("token");

    fetch("/api/profile/password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`  // ✅ required for middleware to accept

        },
        body: JSON.stringify({ currentPassword, newPassword })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.msg || "Password updated successfully");
            currentPasswordInput.value = "";
            newPasswordInput.value = "";
        })
        .catch(() => alert("Error updating password"));
}


function logout() {
    localStorage.clear();
    alert("Logged out successfully.");
    location.href = "index.html";
}
