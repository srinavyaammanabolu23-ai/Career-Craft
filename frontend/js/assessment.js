// ======================================
// Career Craft - Assessment Module
// ======================================

// Assessment Elements
const assessmentSteps = document.querySelectorAll(".assessment-step");
const progressBar = document.querySelector(".progress-bar-inner");

let currentStep = 1;

// --------------------------------------
// Update Assessment UI
// --------------------------------------
function updateAssessmentUI() {

    assessmentSteps.forEach(step => {

        step.classList.remove("active");

        if (Number(step.dataset.step) === currentStep) {
            step.classList.add("active");
        }

    });

    switch (currentStep) {

        case 1:
            progressBar.style.width = "33%";
            break;

        case 2:
            progressBar.style.width = "66%";
            break;

        case 3:
            progressBar.style.width = "100%";
            break;
    }
}

// --------------------------------------
// Assessment Navigation
// --------------------------------------
assessmentPage.addEventListener("click", function (e) {

    // Next
    if (e.target.classList.contains("next")) {

        currentStep++;
        updateAssessmentUI();

    }

    // Previous
    else if (e.target.classList.contains("prev")) {

        currentStep--;
        updateAssessmentUI();

    }

    // Option Selection
    if (e.target.closest(".option-card")) {

        const card = e.target.closest(".option-card");

        card.classList.toggle("selected");

        const currentStepElement = document.querySelector(
            `.assessment-step[data-step="${currentStep}"]`
        );

        const selectedOptions =
            currentStepElement.querySelectorAll(".option-card.selected");

        const nextButton =
            currentStepElement.querySelector(".next, #finishAssessmentBtn");

        if (nextButton) {

            nextButton.disabled = selectedOptions.length === 0;

        }

    }

});

 careerAssessmentBtn.addEventListener('click', () => { showPage(assessmentPage); });
// --------------------------------------
// Finish Assessment
// --------------------------------------
finishAssessmentBtn.addEventListener("click", async function () {

    userAssessment.interests = Array.from(
        document.querySelectorAll(
            '#assessmentPage .assessment-step[data-step="1"] .option-card.selected'
        )
    ).map(el => el.dataset.value);

    userAssessment.skills = Array.from(
        document.querySelectorAll(
            '#assessmentPage .assessment-step[data-step="2"] .option-card.selected'
        )
    ).map(el => el.dataset.value);

    userAssessment.values = Array.from(
        document.querySelectorAll(
            '#assessmentPage .assessment-step[data-step="3"] .option-card.selected'
        )
    ).map(el => el.dataset.value);

    document.getElementById("interestsSummary").innerHTML =
        "<h4>Interests</h4>" +
        userAssessment.interests.map(i => `<span>${i}</span>`).join("");

    document.getElementById("skillsSummary").innerHTML =
        "<h4>Skills</h4>" +
        userAssessment.skills.map(s => `<span>${s}</span>`).join("");

    document.getElementById("valuesSummary").innerHTML =
        "<h4>Values</h4>" +
        userAssessment.values.map(v => `<span>${v}</span>`).join("");

    document.getElementById("careerIdeasContainer").innerHTML = "";

    startLearningBtnContainer.style.display = "none";

// Save Assessment to MongoDB

try {

    const token = Storage.get("token");

    const response = await fetch(`${CONFIG.API_BASE_URL}/assessment`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },

        body: JSON.stringify({
            interests: userAssessment.interests,
            skills: userAssessment.skills,
            values: userAssessment.values
        })

    });

    if (!response.ok) {

        throw new Error("Failed to save assessment.");

    }

    console.log("Assessment saved successfully.");

} catch (error) {

    console.error(error);

    showToast("Assessment could not be saved.", "error");

}

    showPage(resultsPage);

    showToast("Assessment Completed Successfully!", "success", 3000);

});

// --------------------------------------
// Initialize Assessment
// --------------------------------------
updateAssessmentUI();