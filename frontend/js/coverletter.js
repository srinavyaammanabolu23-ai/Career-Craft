// ======================================
// AI Cover Letter Module
// ======================================

// Generate Cover Letter
generateCoverLetterBtn.addEventListener("click", generateCoverLetter);

async function generateCoverLetter() {

    const jobTitle = document.getElementById("clJobTitle").value.trim();
    const company = document.getElementById("clCompany").value.trim();
    const jobDesc = document.getElementById("clJobDesc").value.trim();

    if (!jobTitle || !company || !jobDesc) {

        showToast("Please fill in all the job details.", "warning");
        return;

    }

    // Try getting information from Resume Builder
    const userName =
        document.querySelector("#resumePreview h1")?.textContent || "Candidate";

    const userSkills =
        document.querySelector("#resumePreview h3:last-of-type + p")?.textContent || "";

    const userSummary =
        document.querySelector("#resumePreview h3:first-of-type + p")?.textContent || "";

    const prompt = `
You are a professional HR recruiter and ATS Resume Expert.

Write a professional cover letter.

Requirements:

- Formal tone
- ATS Friendly
- Around 400 words
- Mention applicant skills
- Explain why they fit the role
- Professional closing

Applicant

Name: ${userName}

Skills:
${userSkills}

Summary:
${userSummary}

Job Title:
${jobTitle}

Company:
${company}

Job Description:
${jobDesc}

Return ONLY the cover letter.
`;

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

    loadingModal.style.display = "flex";

    try {

        const letter = await callGeminiAPI(payload);

        loadingModal.style.display = "none";

        if (!letter) {

            showToast("Cover Letter generation failed.", "error");
            return;

        }

        document.getElementById("generatedCoverLetter").value = letter;

        await saveCoverLetter({

            jobTitle,
            company,
            jobDesc,
            content: letter

        });

        showToast("Cover Letter Generated Successfully!", "success", 4000);

    }

    catch (err) {

        loadingModal.style.display = "none";

        console.error(err);

        showToast("Something went wrong.", "error");

    }

}

// ======================================
// Save Cover Letter
// ======================================

async function saveCoverLetter(data) {

    try {

        const token = Storage.get("token");

       console.log("========== SAVE COVER LETTER ==========");
       console.log("Token:", token);
       console.log("API:", `${CONFIG.API_BASE_URL}/coverletter`);

      const response = await fetch(`${CONFIG.API_BASE_URL}/coverletter`, {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
    },

    body: JSON.stringify(data)

});

console.log("Cover Status:", response.status);

const result = await response.text();

console.log("Cover Response:", result);

if (!response.ok) {

    throw new Error("Failed to save Cover Letter.");

}

console.log("Cover Letter saved successfully.");

 } catch (err) {

        console.error(err);
        showToast("Failed to save Cover Letter.", "error");
    };
}
// ======================================
// Load Saved Cover Letter
// ======================================

async function loadCoverLetter() {

    try {

        const token = Storage.get("token");

        console.log("Token:", token);
        console.log("API URL:", `${CONFIG.API_BASE_URL}/coverletter`);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/coverletter`, {

            headers: {

                "x-auth-token": token

            }

        });

        console.log("Status:", response.status);

        if (!response.ok) {

            return;

        }

        const saved = await response.json();
        console.log(document.getElementById("clJobTitle"));
        console.log(document.getElementById("generatedCoverLetter"));

        console.log(saved);
        console.log(saved.coverLetterData);

        console.log("Saved Cover Letter:", saved);

        const data = saved.coverLetterData;

if (!data) {
    console.log("No cover letter data found.");
    return;
}

document.getElementById("clJobTitle").value = data.jobTitle || "";
document.getElementById("clCompany").value = data.company || "";
document.getElementById("clJobDesc").value = data.jobDesc || "";
document.getElementById("generatedCoverLetter").value = data.content || "";

console.log("Cover Letter Loaded Successfully");
    }

    catch (err) {

        console.log("No saved Cover Letter found.");

    }

}

// ======================================
// Download Cover Letter as PDF
// ======================================

async function downloadCoverLetterPDF() {

    try {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({

    orientation: "portrait",

    unit: "mm",

    format: "a4"

});

        const content =
            document.getElementById("generatedCoverLetter").value;

        const lines = pdf.splitTextToSize(content, 180);

        pdf.setFont("times", "normal");
        pdf.setFontSize(12);
        pdf.text(lines, 15, 20);

        pdf.save("CareerCraft_CoverLetter.pdf");

        showToast("Cover Letter Downloaded Successfully!", "success");

    }

    catch (err) {

        console.error(err);

        showToast("Unable to download PDF.", "error");

    }

}

// ======================================
// Event Listeners
// ======================================
coverLetterBtn.addEventListener("click", async () => {

    showPage(coverLetterPage);

    setTimeout(async () => {

        await loadCoverLetter();

    }, 100);

});

// Optional download button
const downloadCoverLetterBtn =
    document.getElementById("downloadCoverLetterBtn");

if (downloadCoverLetterBtn) {

    downloadCoverLetterBtn.addEventListener(
        "click",
        downloadCoverLetterPDF
    );

}