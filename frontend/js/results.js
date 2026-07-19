// ======================================
// Career Craft - Results Module
// ======================================

// --------------------------------------
// Generate Career Ideas
// --------------------------------------

generateIdeasBtn.addEventListener("click", async () => {

    const prompt = `Based on a user's self-assessment, generate 4 suitable career path ideas.

User Interests:
${userAssessment.interests.join(", ")}

User Skills:
${userAssessment.skills.join(", ")}

User Values:
${userAssessment.values.join(", ")}`;

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]
    };

    const data = await callGeminiAPI(payload);

    if (!data || !data.careers) return;

    const container = document.getElementById("careerIdeasContainer");

    container.innerHTML =
        "<h3>Select a Career Path</h3>";

    data.careers.forEach(career => {

        const card = document.createElement("div");

        card.className = "career-idea-card";

        card.innerHTML = `
            <h4>${career.title}</h4>
            <p>${career.description}</p>
        `;

        card.addEventListener("click", () => {

            selectCareerIdea(card, career.title);

        });

        container.appendChild(card);

    });

});

// --------------------------------------
// Select Career Card
// --------------------------------------

function selectCareerIdea(card, title) {

    document.querySelectorAll(".career-idea-card")
        .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");

    selectedCareerTitle = title;

    startLearningBtnContainer.style.display = "block";

}

// --------------------------------------
// Start Learning Path
// --------------------------------------

startLearningBtn.addEventListener("click", () => {

    if (!selectedCareerTitle) {

        showToast("Please select a career first.", "warning");

        return;

    }

    generatePersonalizedPath(selectedCareerTitle);

});