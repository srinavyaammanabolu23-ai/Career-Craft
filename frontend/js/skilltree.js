 // --- Skill Tree Logic ---
        function renderSkillTree() {
            const container = document.getElementById('skillTreeContainer');
            document.getElementById('skillTreeHeader').innerHTML = `Your Skill Tree: <strong>${generatedPathData.careerTitle}</strong>`;
            container.innerHTML = ''; // Clear previous tree

            let totalSkills = 0;

            let completedSkills = 0;
            
            if (!currentSkillTree || !Array.isArray(currentSkillTree)) {

    console.log("Invalid Skill Tree:", currentSkillTree);

    showToast("Skill Tree data is invalid.", "error");

    return;

}

            currentSkillTree.forEach(branch => {
                const branchDiv = document.createElement('div');
                branchDiv.className = 'skill-branch';
                let isBranchComplete = true;

                let skillsHTML = `<h3>${branch.name}</h3>`;


                branch.nodes.forEach(skill => {
    totalSkills++;

    if (skill.status === "completed") {
        completedSkills++;
    }

    skillsHTML += `
        <div class="skill-node ${skill.status}" data-skill-id="${skill.id}">
            <i class="${skill.icon}"></i>
            <span>${skill.name}</span>
        </div>
    `;

    if (skill.status !== "completed") {
        isBranchComplete = false;
    }

});
                branchDiv.innerHTML = skillsHTML;
                if (isBranchComplete) {
                    branchDiv.classList.add('completed');
                }
                container.appendChild(branchDiv);
            });

            const percentage =
totalSkills === 0
? 0
: Math.round((completedSkills / totalSkills) * 100);

document.getElementById("skillProgressFill").style.width =
percentage+"%";

document.getElementById("skillProgressText").innerText =
percentage+"%";
        }

        document.getElementById('skillTreeContainer').addEventListener('click', (e) => {
            const node = e.target.closest('.skill-node');
            if (node && node.classList.contains('unlocked')) {
                const skillId = node.dataset.skillId;
                skillToValidate = skillId;
                
                // Find skill details
                let skillDetails;
                for(const branch of currentSkillTree) {
                    const found = branch.nodes.find(s => s.id === skillId);
                    if(found) {
                        skillDetails = found;
                        break;
                    }
                }

                if (skillDetails) {
                    document.getElementById('projectModalTitle').textContent = skillDetails.projectTitle;
                    document.getElementById('projectModalDesc').textContent = skillDetails.projectDescription;
                    document.getElementById('projectDetails').value = '';
                    document.getElementById('projectFeedback').style.display = 'none';
                    projectModal.style.display = 'flex';
                }
            }
        });

        closeProjectModalBtn.addEventListener('click', () => {
            projectModal.style.display = 'none';
        });

        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const projectDesc = document.getElementById('projectDetails').value;
            if(!projectDesc.trim()) {
                showToast("Please describe your project before submitting.", "warning");
                return;
            }

            const prompt = `Provide brief, encouraging feedback on this project description for a portfolio, focusing on whether it demonstrates the intended skill. Project Description: "${projectDesc}"`;
            const payload = { contents: [{ parts: [{ text: prompt }] }] };

            const feedback = await callGeminiAPI(payload);
            if(feedback) {
                const feedbackDiv = document.getElementById('projectFeedback');
                feedbackDiv.innerHTML = `<strong>AI Feedback:</strong><br>${feedback.replace(/\n/g, '<br>')}`;
                feedbackDiv.style.display = 'block';

                // Mark skill as complete and unlock next one
                let skillCompleted = false;
                for (let i = 0; i < currentSkillTree.length; i++) {
                    const branch = currentSkillTree[i];
                    for (let j = 0; j < branch.nodes.length; j++) {
                        if (branch.nodes[j].id === skillToValidate) {
                            branch.nodes[j].status = 'completed';
                            // Unlock the next skill in the same branch
                            if (j + 1 < branch.nodes.length) {
                                branch.nodes[j+1].status = 'unlocked';
                            } 
                            // Or unlock the first skill of the next branch
                            else if (i + 1 < currentSkillTree.length) {
                                currentSkillTree[i+1].nodes[0].status = 'unlocked';
                            }
                            skillCompleted = true;
                            break;
                        }
                    }
                    if(skillCompleted) break;
                }

               try {

    const token = Storage.get("token");

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

    console.log("Skill Tree saved successfully.");

} catch (error) {

    console.error(error);

    showToast("Failed to save Skill Tree.", "error");

}
                renderSkillTree();

                showToast("Project Submitted Successfully!", "success", 4000);
                setTimeout(() => {
                    projectModal.style.display = 'none';
                }, 2000); // Close modal after showing feedback for a few seconds
            }
        });

        skillTreeBtn.addEventListener("click", async () => {

    try {

        const token = Storage.get("token");

        const [treeResponse, pathResponse] = await Promise.all([

            fetch(`${CONFIG.API_BASE_URL}/skilltree`, {

                headers: {
                    "x-auth-token": token
                }

            }),

            fetch(`${CONFIG.API_BASE_URL}/path`, {

                headers: {
                    "x-auth-token": token
                }

            })

        ]);

        if (!treeResponse.ok || !pathResponse.ok) {

            throw new Error();

        }

       const treeData = await treeResponse.json();
      
       console.log("Tree Data:", treeData);
console.log("treeData.treeData:", treeData.treeData);
console.log("treeData.treeData.branches:", treeData.treeData.branches);

currentSkillTree = treeData.treeData.branches;

console.log("Current Skill Tree:", currentSkillTree);
console.log("First Branch:", currentSkillTree[0]);
console.log("First Branch Nodes:", currentSkillTree[0].nodes);
renderSkillTree();

showPage(skillTreePage);
    } catch (error) {

        console.error(error);

        showToast(
            "Complete your assessment and generate a career path first.",
            "warning"
        );

        showPage(assessmentPage);

    }

});