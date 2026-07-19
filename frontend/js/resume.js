

generateResumeBtn.addEventListener('click', async function() {
            const userInput = document.getElementById('resumeInputText').value;
            if (!userInput.trim()) {
               showToast("Enter your details before generating the resume.", "warning");
                return;
            }
            const resumePreview = document.getElementById('resumePreview');
            resumePreview.innerHTML = '<p style="text-align:center;">Generating your resume...</p>';

            const prompt = `Based on the following raw text provided by a user, generate a professionally structured resume. Raw text: "${userInput}"`;
            
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
            };
            
            
console.log("Calling Gemini...");
const resumeData = await callGeminiAPI(payload);
loadingModal.style.display = "none";
console.log("Gemini returned:", resumeData);
            if (resumeData) {
                 await renderGeneratedResume(resumeData);

                 showToast("Resume Generated Successfully!", "success", 5000);
            } else {
                // Restore the original content if the API call fails
                resumePreview.innerHTML = initialResumePreviewHTML;
                 showToast("Resume generation failed." , "error");
            }
        });

       async function renderGeneratedResume(data) {

        console.log("renderGeneratedResume() called");
        console.log(data);
            const resumePreview = document.getElementById('resumePreview');
            
            // Build the new HTML structure
            let newHtml = `
                <h1>${data.name || 'Your Name'}</h1>
                <p>${data.title || 'Your Title'}</p>
                <div class="preview-contact">
                    <span>${data.email || ''}</span>
                    ${data.phone ? `| <span>${data.phone}</span>` : ''}
                    ${data.location ? `| <span>${data.location}</span>` : ''}
                </div>
                <hr>
                <h3>Professional Summary</h3>
                <p>${data.summary || ''}</p>
            `;

            if (data.experience && data.experience.length > 0) {
                newHtml += '<hr><h3>Work Experience</h3>';
                data.experience.forEach(job => {
                    let descriptionHtml = job.description || '';
                    if (descriptionHtml.includes('*')) {
                        const points = descriptionHtml.split('*').filter(p => p.trim() !== '');
                        descriptionHtml = '<ul>' + points.map(p => `<li>${p.trim()}</li>`).join('') + '</ul>';
                    } else {
                        descriptionHtml = `<p>${descriptionHtml}</p>`;
                    }
                    newHtml += `
                        <div>
                            <h4>${job.jobTitle || ''}</h4>
                            <p><em>${job.company || ''} | ${job.dates || ''}</em></p>
                            ${descriptionHtml}
                        </div>
                    `;
                });
            }

            if (data.education && data.education.length > 0) {
                newHtml += '<hr><h3>Education</h3>';
                data.education.forEach(edu => {
                    newHtml += `<div><p><strong>${edu.degree || ''}</strong> - ${edu.school || ''}</p></div>`;
                });
            }

            if (data.skills && data.skills.length > 0) {
                 newHtml += `<hr><h3>Skills</h3><p>${data.skills.join(', ')}</p>`;
            }
            
            // Set the new HTML content
            resumePreview.innerHTML = newHtml;

            // Save Resume to MongoDB
try {


    console.log("====== Saving Resume ======");
    console.log("Resume Data:", data);

    const token = Storage.get("token");
    console.log("Token:", token);

    const response = await fetch(`${CONFIG.API_BASE_URL}/resume`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },

        body: JSON.stringify(data)

    });

    console.log("Resume Save Status:", response.status);

    if (!response.ok) {

        const error = await response.text();
        console.log("Server Response:", error);

        throw new Error("Failed to save Resume.");

    }

    console.log("Resume saved successfully.");
    loadingModal.style.display = "none";

} catch (err) {
    loadingModal.style.display = "none";
    console.error(err);

    showToast("Failed to save Resume.", "error");

}
        }


        downloadPdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const resume = document.getElementById('resumePreview');
            
            html2canvas(resume, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("resume.pdf");
            });
        });

 resumeBuilderBtn.addEventListener("click", async () => {

    console.log("Resume Builder button clicked");

    showPage(resumePage);

});

