
/* ==========================================
   CAREER CRAFT - AUTHENTICATION
   Login + Create Account
   ========================================== */

(() => {
    "use strict";

    const getElement = (id) => document.getElementById(id);

    const loginForm = getElement("loginForm");
    const loginPage = getElement("loginPage");
    const loginCard = document.querySelector("#loginPage .login-card");

    const dashboard = getElement("dashboard");
    const divider = loginCard?.querySelector(".divider");
    const socialLogin = loginCard?.querySelector(".social-login");
    const googleButton = getElement("googleSignIn");
    const logoutButton = getElement("logoutButton");

    // Check required elements before adding handlers.
    if (!loginForm || !loginCard || !loginPage || !dashboard) {
        console.error(
            "Authentication setup failed: required HTML elements are missing."
        );
        return;
    }

    // ======================================
    // NOTIFICATION HELPER
    // ======================================

    function notify(message, type = "info") {
        if (typeof showToast === "function") {
            showToast(message, type);
        } else {
            alert(message);
        }
    }

    // ======================================
    // CREATE ACCOUNT UI
    // ======================================

    const createAccountPrompt = document.createElement("p");

    createAccountPrompt.style.cssText = `
        text-align: center;
        color: #dddddd;
        margin: 20px 0;
    `;

    createAccountPrompt.innerHTML = `
        New to Career Craft?
        <button
            type="button"
            id="openRegisterButton"
            style="
                background: none;
                border: none;
                color: #aee8ff;
                font-weight: bold;
                cursor: pointer;
                font-size: inherit;
            ">
            Create Account
        </button>
    `;

    loginForm.insertAdjacentElement(
        "afterend",
        createAccountPrompt
    );

    // ======================================
    // REGISTRATION FORM
    // ======================================

    const registerPanel = document.createElement("section");

    registerPanel.id = "registerPanel";
    registerPanel.style.cssText = `
        display: none;
        width: 100%;
        margin-top: 18px;
        color: white;
    `;

    registerPanel.innerHTML = `
        <h2 style="text-align:center;margin-bottom:10px;">
            Create Account
        </h2>

        <p style="text-align:center;color:#cccccc;margin-bottom:22px;">
            Start building your career journey with Career Craft.
        </p>

        <form id="registerForm">

            <div class="input-group">
                <input
                    type="text"
                    id="registerName"
                    placeholder="Full Name"
                    autocomplete="name"
                    required
                >
            </div>

            <div class="input-group">
                <input
                    type="email"
                    id="registerEmail"
                    placeholder="Email Address"
                    autocomplete="email"
                    required
                >
            </div>

            <div class="input-group">
                <input
                    type="password"
                    id="registerPassword"
                    placeholder="Create Password"
                    minlength="8"
                    autocomplete="new-password"
                    required
                >
            </div>

            <div class="input-group">
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    minlength="8"
                    autocomplete="new-password"
                    required
                >
            </div>

            <button type="submit" class="signin-btn">
                Create Account
            </button>

        </form>

        <p style="text-align:center;margin-top:20px;color:#dddddd;">
            Already have an account?
            <button
                type="button"
                id="backToLoginButton"
                style="
                    background:none;
                    border:none;
                    color:#aee8ff;
                    cursor:pointer;
                    font-weight:bold;
                    font-size:inherit;
                ">
                Sign In
            </button>
        </p>
    `;

    loginCard.appendChild(registerPanel);

    const registerForm = getElement("registerForm");
    const openRegisterButton = getElement("openRegisterButton");
    const backToLoginButton = getElement("backToLoginButton");

    // ======================================
    // SWITCH BETWEEN LOGIN AND REGISTER
    // ======================================

    function showLoginForm() {
        loginForm.style.display = "block";
        createAccountPrompt.style.display = "block";

        if (divider) divider.style.display = "flex";
        if (socialLogin) socialLogin.style.display = "flex";

        registerPanel.style.display = "none";
    }

    function showRegisterForm() {
        loginForm.style.display = "none";
        createAccountPrompt.style.display = "none";

        if (divider) divider.style.display = "none";
        if (socialLogin) socialLogin.style.display = "none";

        registerPanel.style.display = "block";
    }

    openRegisterButton.addEventListener(
        "click",
        showRegisterForm
    );

    backToLoginButton.addEventListener(
        "click",
        showLoginForm
    );

    // ======================================
    // COMPLETE LOGIN OR REGISTRATION
    // ======================================

    function completeAuthentication(data, message) {
        if (!data || !data.token) {
            notify("Authentication failed. Please try again.", "error");
            return;
        }

        Storage.save("token", data.token);
        Storage.save("loggedIn", true);

        if (typeof data.streak === "number") {
            Storage.save("streakCount", data.streak);
        }

        showPage(dashboard);

        notify(message, "success");
    }

    async function sendAuthenticationRequest(endpoint, payload) {
        const response = await fetch(
            `${CONFIG.API_BASE_URL}/auth/${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.msg || "Authentication request failed."
            );
        }

        return data;
    }

    // ======================================
    // LOGIN EXISTING USER
    // ======================================

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = getElement("email")
            .value.trim().toLowerCase();

        const password = getElement("password").value;

        if (!email || !password) {
            notify("Enter your email and password.", "error");
            return;
        }

        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Signing In...";
        }

        try {
            const data = await sendAuthenticationRequest(
                "login",
                { email, password }
            );

            completeAuthentication(
                data,
                "Welcome back to Career Craft!"
            );

        } catch (error) {
            console.error("Login request failed:", error.message);
            notify(error.message, "error");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Sign In";
            }
        }
    });

    // ======================================
    // REGISTER NEW USER
    // ======================================

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = getElement("registerName")
            .value.trim();

        const email = getElement("registerEmail")
            .value.trim().toLowerCase();

        const password = getElement("registerPassword").value;

        const confirmPassword = getElement("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            notify("Please complete all fields.", "error");
            return;
        }

        if (password.length < 8) {
            notify(
                "Password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        if (password !== confirmPassword) {
            notify("Passwords do not match.", "error");
            return;
        }

        const submitButton = registerForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }

        try {
            const data = await sendAuthenticationRequest(
                "register",
                { name, email, password }
            );

            completeAuthentication(
                data,
                "Your Career Craft account was created successfully!"
            );

        } catch (error) {
            console.error(
                "Registration request failed:",
                error.message
            );

            notify(error.message, "error");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }
        }
    });

    // ======================================
    // GOOGLE LOGIN - NOT CONFIGURED YET
    // ======================================

    if (googleButton) {
        googleButton.addEventListener("click", () => {
            notify(
                "Google sign-in is not configured yet. Please use email and password.",
                "warning"
            );
        });
    }

    // ======================================
    // FORGOT PASSWORD - NOT CONFIGURED YET
    // ======================================

    const forgotPassword = loginCard.querySelector(
        ".forgot-password"
    );

    if (forgotPassword) {
        forgotPassword.addEventListener("click", (event) => {
            event.preventDefault();

            notify(
                "Email password recovery has not been configured yet.",
                "warning"
            );
        });
    }

    // ======================================
    // LOGOUT
    // ======================================

    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();

            Storage.remove("token");
            Storage.remove("loggedIn");
            Storage.remove("streakCount");

            showPage(loginPage);
            showLoginForm();
        });
    }

    // ======================================
    // INITIAL PAGE
    // ======================================

    window.addEventListener("load", () => {
        const token = Storage.get("token");
        const loggedIn = Storage.get("loggedIn");

        if (loggedIn && token) {
            showPage(dashboard);
        } else {
            Storage.remove("loggedIn");
            showPage(loginPage);
        }
    });

})();
