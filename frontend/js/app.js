// --- DOM Elements ---
        const splash = document.getElementById('splashScreen');
        const loginPage = document.getElementById('loginPage');
        const dashboard = document.getElementById('dashboard');
        const assessmentPage = document.getElementById('assessmentPage');
        const resultsPage = document.getElementById('resultsPage');
        const pathsPage = document.getElementById('pathsPage');
        const resourcesPage = document.getElementById('resourcesPage');
        const interviewPage = document.getElementById('interviewPage');
        const resumePage = document.getElementById('resumePage');
        const coverLetterPage = document.getElementById('coverLetterPage');
        const skillTreePage = document.getElementById('skillTreePage');
        const loadingModal = document.getElementById('loadingModal');
        const notificationModal = document.getElementById('notificationModal');
        const projectModal = document.getElementById('projectModal');
        const profilePage = document.getElementById('profilePage');
        const apiKeyModal = document.getElementById('apiKeyModal');
        const apiKeyInput = document.getElementById('apiKeyInput');
        const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
        const loginForm = document.getElementById('loginForm');
        const googleSignInButton = document.getElementById('googleSignIn');
        const logoutButton = document.getElementById('logoutButton');
        const profileIcon = document.querySelector('.profile-icon');
        const careerAssessmentBtn = document.getElementById('careerAssessmentBtn');
        const personalizedPathsBtn = document.getElementById('personalizedPathsBtn');
        const skillTreeBtn = document.getElementById('skillTreeBtn');
        const viewPathsBtnHero = document.getElementById('viewPathsBtnHero');
        const learningResourcesBtn = document.getElementById('learningResourcesBtn');
        const interviewPrepBtn = document.getElementById('interviewPrepBtn');
        const resumeBuilderBtn = document.getElementById('resumeBuilderBtn');
        const coverLetterBtn = document.getElementById('coverLetterBtn');
        const jobsPage = document.getElementById("jobsPage");
        const backToDashboardBtn = document.getElementById('backToDashboardBtn');
        const backToDashboardBtn2 = document.getElementById('backToDashboardBtn2');
        const backToDashboardBtn3 = document.getElementById('backToDashboardBtn3');
        const backToDashboardBtn4 = document.getElementById('backToDashboardBtn4');
        const backToDashboardBtn5 = document.getElementById('backToDashboardBtn5');
        const backToDashboardBtn6 = document.getElementById('backToDashboardBtn6');
        const backToDashboardBtn7 = document.getElementById('backToDashboardBtn7');
        const backToDashboardBtn8 = document.getElementById('backToDashboardBtn8');
        const backToAssessmentBtn = document.getElementById('backToAssessmentBtn');
        const finishAssessmentBtn = document.getElementById('finishAssessmentBtn');
        const generateIdeasBtn = document.getElementById('generateIdeasBtn');
        const startLearningBtnContainer = document.getElementById('startLearningBtnContainer');
        const startLearningBtn = document.getElementById('startLearningBtn');
        const allowNotificationsBtn = document.getElementById('allowNotificationsBtn');
        const dismissNotificationsBtn = document.getElementById('dismissNotificationsBtn');
        const streakCountSpan = document.getElementById('streakCount');
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        const generateResumeBtn = document.getElementById('generateResumeBtn');
        const generateCoverLetterBtn = document.getElementById('generateCoverLetterBtn');
        const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
        const projectForm = document.getElementById('projectForm');

         // --- State Management ---
        window.userAssessment = { interests: [], skills: [], values: [] };
        window.generatedPathData = null; // Stores the generated path
        window.selectedCareerTitle = null; // Stores the currently selected career idea
        window.currentSkillTree = null; // To hold the skill tree data
        window.skillToValidate = null; // To hold the ID of the skill being validated
        window.userApiKey = null; // To store the user's provided API key for the session
        window.pendingApiCall = null; // To hold an API call that is pending an API key
        const initialResumePreviewHTML = document.getElementById('resumePreview').innerHTML;

         // --- UI Transitions ---
        function showPage(pageToShow) {
                showLoader();
            const pages = [loginPage, dashboard, assessmentPage, resultsPage, pathsPage, resourcesPage, interviewPage, resumePage, coverLetterPage, skillTreePage, profilePage,jobsPage];
            
            if (pages.slice(1).includes(pageToShow)) { // All pages except login
                document.body.style.backgroundColor = '#f5f7fa'; 
                document.body.style.overflow = 'auto';
            } else {
                document.body.style.backgroundColor = '#1a1a2e'; 
                document.body.style.overflow = 'hidden';
            }

            pages.forEach(p => p.style.opacity = '0');

            function showLoader() {
    document.getElementById("pageLoader").classList.add("show");
}

function hideLoader() {
    document.getElementById("pageLoader").classList.remove("show");
}

            function updateDashboardGreeting() {

    const greeting = document.getElementById("dashboardGreeting");
    const subGreeting = document.getElementById("dashboardSubGreeting");

    if (!greeting) return;

    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.innerHTML = "Good Morning ☀️";
        subGreeting.innerHTML = "Let's build your career today!";
    } else if (hour < 17) {
        greeting.innerHTML = "Good Afternoon 🌤️";
          subGreeting.innerHTML = "Keep progressing toward your dream career.";
    } else {
        greeting.innerHTML = "Good Evening 🌙";
        subGreeting.innerHTML = "Great time to learn something new!";
    }

}

function loadCareerTip() {

    const tips = [

        "Build one real-world project every month.",

        "Keep your GitHub repositories updated regularly.",

        "Practice coding at least 30 minutes every day.",

        "Learn one new technology every semester.",

        "Improve your communication skills along with coding.",

        "Update your resume after every new project.",

        "Contribute to open-source projects to gain experience.",

        "Networking is as important as technical skills."

    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    document.getElementById("careerTip").textContent = randomTip;

}

function updateDashboardStats(){

    
    animateCounter("statSkills", userAssessment.skills.length);
    const savedPath = JSON.parse(localStorage.getItem("careerCraftPath"));

    document.getElementById("statCareer").textContent =
        savedPath ? savedPath.careerTitle : "--";

}

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let count = 0;

    const increment = Math.max(1, Math.ceil(target / 30));

    const timer = setInterval(() => {

        count += increment;

        if (count >= target) {
            count = target;
            clearInterval(timer);
        }

        element.textContent = count;

    }, 20);

}
            setTimeout(() => {
                pages.forEach(p => p.style.display = 'none');
                
                if(pageToShow === loginPage || pageToShow === splash) pageToShow.style.display = 'grid';
                else if (pageToShow === resumePage || pageToShow === coverLetterPage || pageToShow === profilePage) pageToShow.style.display = 'flex';
                else pageToShow.style.display = 'flex';


                setTimeout(() => {
                    hideLoader();
                    pageToShow.style.opacity = '1';
                    if(pageToShow === dashboard) {
                        updateStreak();
                        setupNotifications();
                        updateDashboardGreeting();
                         loadCareerTip();
                         updateDashboardStats();
                    }
                }, 50);
            }, 500);
        }

        // Initial Splash Screen transition
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }, 3000);
        
       