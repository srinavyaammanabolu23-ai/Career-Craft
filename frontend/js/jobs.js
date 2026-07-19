const jobsContainer = document.getElementById("jobsContainer");
const jobRecommendationsBtn = document.getElementById("jobRecommendationsBtn");
const jobsBackBtn = document.getElementById("backToDashboardJobs");


// Back button
jobsBackBtn.addEventListener("click", () => {
    showPage(dashboard);
});

// Display Jobs
function displayJobs(jobs) {

    jobsContainer.innerHTML = "";

    jobs.forEach(job => {

       jobsContainer.innerHTML += `

<div class="job-card">

    <h2>${job.title}</h2>

    <h3>${job.company}</h3>

    <p>📍 ${job.location}</p>

    <p>💰 ${job.salary}</p>

    <p>💼 ${job.experience}</p>

    <p>

        ${job.skills.map(skill => `
            <span class="skill-tag">${skill}</span>
        `).join("")}

    </p>

    <a
        href="${job.url}"
        target="_blank"
        class="assessment-btn">

        Apply Now

    </a>

</div>
`;

    });

}

jobRecommendationsBtn.addEventListener("click", async () => {

    console.log("Job Recommendation button clicked");

    try {

        const token = Storage.get("token");

        console.log("Token:", token);

        const pathResponse = await fetch(`${CONFIG.API_BASE_URL}/path`, {

            headers: {
                "x-auth-token": token
            }

        });

        if (!pathResponse.ok) {

            throw new Error("Career Path not found.");

        }

        const pathData = await pathResponse.json();

        const prompt = `
Generate job recommendations for the following career.

Career:

${pathData.careerTitle}

Return ONLY JSON in this format:

{
    "jobs":[]
}
`;

        const aiResponse = await fetch(`${CONFIG.API_BASE_URL}/ai/chat`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt
            })

        });

        const aiData = await aiResponse.json();

        const jobs = JSON.parse(aiData.response).jobs;

        await fetch(`${CONFIG.API_BASE_URL}/jobs`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "x-auth-token": token

            },

            body: JSON.stringify({

                jobs

            })

        });

        const loadResponse = await fetch(`${CONFIG.API_BASE_URL}/jobs`, {

            headers: {

                "x-auth-token": token

            }

        });

       const savedJobs = await loadResponse.json();

console.log("Saved Jobs:", savedJobs);

displayJobs(savedJobs);

console.log("After displayJobs");

showPage(jobsPage);

console.log("After showPage");

    }

    catch(err){

        console.error(err);

        showToast("Unable to load jobs.","error");

    }

});