
        backToDashboardBtn.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn2.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn3.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn4.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn5.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn6.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn7.addEventListener('click', () => { showPage(dashboard); });
        backToDashboardBtn8.addEventListener('click', () => { showPage(dashboard); });
        
        backToAssessmentBtn.addEventListener('click', () => {
            // Clear saved path if user wants to redo
            localStorage.removeItem('careerCraftPath');
            localStorage.removeItem('skillTreeData');
            generatedPathData = null;
            currentSkillTree = null;
            showPage(assessmentPage); 
        });