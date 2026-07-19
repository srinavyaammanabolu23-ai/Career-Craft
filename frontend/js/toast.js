// ======================================
// Toast Notification System
// ======================================

function showToast(message, type = "info", duration = 3000) {

    const oldToast = document.querySelector(".toast-notification");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;

    let icon = "ℹ️";

    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 400);

    },  duration);
}