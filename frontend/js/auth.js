 //
// Google Login======================================
// Authentication Module
// ======================================

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);

        if (!response.ok) {

            showToast(data.msg || "Login Failed", "error");

            return;

        }

        Storage.save("token", data.token);

        console.log("TOKEN SAVED:", Storage.get("token"));

        Storage.save("loggedIn", true);

        showPage(dashboard);

        showToast("Welcome to Career Craft!", "success");

    }

    catch (err) {

        console.error(err);

        showToast("Unable to connect to server.", "error");

    }

});

googleSignInButton.addEventListener("click", function () {
   
    Storage.save("token", data.token);
    Storage.save("loggedIn", true);
    Storage.save("streakCount", data.streak);

    showPage(dashboard);

    showToast("Welcome to Career Craft!", "success", 3000);
});

// Logout
logoutButton.addEventListener("click", function () {

    Storage.remove("loggedIn");
    Storage.remove("token");
    Storage.remove("careerCraftPath");
    Storage.remove("skillTreeData");

    generatedPathData = null;
    currentSkillTree = null;
    userApiKey = null;

    showPage(loginPage);
});

// Auto Login
window.addEventListener("load", function () {

    const loggedIn = Storage.get("loggedIn");

    if (loggedIn) {
        showPage(dashboard);
    } else {
        showPage(loginPage);
    }

});