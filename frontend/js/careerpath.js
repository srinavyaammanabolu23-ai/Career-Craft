  const openPersonalizedPaths = async () => {

    try {

        const token = Storage.get("token");
        console.log("SkillTree Token:", token);

        const response = await fetch(`${CONFIG.API_BASE_URL}/path`, {

            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            }

        });

        if (!response.ok) {

            throw new Error("Career Path not found.");

        }

        generatedPathData = await response.json();

        populateAndShowPathsPage(generatedPathData);

    } catch (error) {

        console.error(error);

        showToast("Please generate a Career Path first.", "warning");

        showPage(assessmentPage);

    }

};

personalizedPathsBtn.addEventListener("click", openPersonalizedPaths);

viewPathsBtnHero.addEventListener("click", () => {
    document.querySelector("#dashboard .features")
        .scrollIntoView({ behavior: "smooth" });
});
        viewPathsBtnHero.addEventListener('click', () => {
            document.querySelector('#dashboard .features').scrollIntoView({ behavior: 'smooth' });
        });

        function populateAndShowPathsPage(pathData) {
            const skillsGapContainer = document.getElementById('pathSkillsGap');
            skillsGapContainer.innerHTML = `
                <h3>Your Path to becoming a <strong>${pathData.careerTitle}</strong></h3>
                <div class="skills-columns">
                    <div class="skills-list">
                        <h4><i class="fas fa-check-circle have"></i> Skills You Have</h4>
                        <ul>${pathData.skillsHave.map(s => `<li><i class="fas fa-star have"></i> ${s}</li>`).join('')}</ul>
                    </div>
                    <div class="skills-list">
                        <h4><i class="fas fa-exclamation-circle need"></i> Skills You Need</h4>
                        <ul>${pathData.skillsNeed.map(s => `<li><i class="fas fa-plus-circle need"></i> ${s}</li>`).join('')}</ul>
                    </div>
                </div>`;

            const timelineContainer = document.getElementById('pathTimeline');
            timelineContainer.innerHTML = '';
            pathData.milestones.forEach((milestone, index) => {
                 timelineContainer.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-dot">${index + 1}</div>
                        <div class="timeline-content">
                            <h4>${milestone.title} <button class="complete-btn">Mark Complete</button></h4>
                            <p>${milestone.description}</p>
                        </div>
                    </div>`;
            });
            timelineContainer.innerHTML += `
                 <div class="timeline-item">
                     <div class="timeline-dot"><i class="fas fa-flag-checkered"></i></div>
                    <div class="timeline-content">
                        <h4>Start Applying!</h4>
                        <p>You've built a strong foundation. It's time to craft your resume and start applying for ${pathData.careerTitle} roles.</p>
                    </div>
                </div>`;

            showPage(pathsPage);
        }
        async function generatePersonalizedPath(careerTitle) {
            const prompt = `Generate a personalized career path and a skill tree for a user aiming to become a "${careerTitle}". The user already has skills in [${userAssessment.skills.join(', ')}]. 
            1.  Create a step-by-step timeline with 3-4 milestones (title, description).
            2.  Identify 3 key skills they need to acquire.
            3.  Generate 5 common interview questions (question, answer).
            4.  Design a skill tree with 3 branches (e.g., 'Foundational', 'Intermediate', 'Advanced'). Each branch should have 2-3 skill nodes. Each node needs an 'id' (e.g., 'html_basics'), a 'name', an 'icon' (Font Awesome class e.g., 'fas fa-code'), a 'projectTitle', and a 'projectDescription'. The first node of the first branch should have a 'status' of 'unlocked', all others 'locked'.`;

             const payload = { contents: [{ parts: [{ text: prompt }] }] };
            
            const data = await callGeminiAPI(payload);
            if(data && data.milestones && data.skillTree) {
                generatedPathData = {
                    careerTitle,
                    skillsHave: userAssessment.skills,
                    skillsNeed: data.skillsNeed,
                    milestones: data.milestones,
                    interviewQuestions: data.interviewQuestions
                };
                currentSkillTree = data.skillTree;

                // Save Skill Tree to MongoDB immediately

try {

    const token = Storage.get("token");

    console.log("Frontend Token:", token);
console.log(typeof token);

    const response = await fetch(`${CONFIG.API_BASE_URL}/skilltree`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token

        },

        body: JSON.stringify({

            treeData: currentSkillTree

        })

    });

    if (!response.ok) {

        throw new Error("Failed to save Skill Tree.");

    }

    console.log("Career Path saved successfully.");

   // Save Career Path locally
localStorage.setItem(
    "careerCraftPath",
    JSON.stringify(generatedPathData)
);

console.log(
    "Saved to localStorage:",
    localStorage.getItem("careerCraftPath")
);

// Save Skill Tree locally
localStorage.setItem(
    "skillTreeData",
    JSON.stringify(currentSkillTree)
);

} catch (err) {

    console.error(err);

     showToast("Failed to save Career Path.", "error");

}
                
               // Save Career Path to MongoDB
try {

    const token = Storage.get("token");

    console.log("Frontend Token:", token);

    const response = await fetch(`${CONFIG.API_BASE_URL}/path`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },

        body: JSON.stringify(generatedPathData)

    });

    if (!response.ok) {

        throw new Error("Failed to save Career Path.");

    }

    console.log("Career Path saved successfully.");

    // Keep Skill Tree in localStorage for now
    localStorage.setItem("skillTreeData", JSON.stringify(currentSkillTree));

} catch (error) {

    console.error(error);

    showToast("Failed to save Career Path.", "error");

}
                populateAndShowPathsPage(generatedPathData);
                showToast("Career Path Generated Successfully!", "success", 4000);
            }
        }