// Open Profile
profileIcon.addEventListener('click', () => {
    populateProfilePage();
    showPage(profilePage);
});

function populateProfilePage() {
            // Basic Info (can be made editable later)
            document.getElementById('profileName').textContent = document.querySelector('#resumePreview h1').textContent;
            document.getElementById('profileEmail').textContent = document.querySelector('#resumePreview .preview-contact span:first-of-type').textContent;


            // Stats
            document.getElementById('profileStreak').textContent = localStorage.getItem('streakCount') || '0';
            const savedPath = localStorage.getItem('careerCraftPath');
            if (savedPath) {
                const pathData = JSON.parse(savedPath);
                document.getElementById('profilePath').textContent = pathData.careerTitle;
            } else {
                document.getElementById('profilePath').textContent = 'Not Set';
            }
        }

 // Assessment Summary
            const assessmentDetailsContainer = document.getElementById('profileAssessmentDetails');
            if (userAssessment.interests.length > 0 || userAssessment.skills.length > 0 || userAssessment.values.length > 0) {
                assessmentDetailsContainer.innerHTML = `
                    <div class="summary-list">
                        <h5>Interests</h5>
                        ${userAssessment.interests.map(i => `<span>${i}</span>`).join('')}
                    </div>
                    <div class="summary-list">
                        <h5>Skills</h5>
                        ${userAssessment.skills.map(s => `<span>${s}</span>`).join('')}
                    </div>
                    <div class="summary-list">
                        <h5>Values</h5>
                        ${userAssessment.values.map(v => `<span>${v}</span>`).join('')}
                    </div>
                `;
            } else {
                assessmentDetailsContainer.innerHTML = '<p>Complete the career assessment to see your summary here.</p>';
            }
        