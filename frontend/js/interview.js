let currentInterviewSession = [];

function populateAndShowInterviewPage(pathData) {
            const faqContainer = document.getElementById('faqAccordion');
            document.getElementById('interviewTitle').innerHTML = `Practice Questions for a <strong>${pathData.careerTitle}</strong>`;
            faqContainer.innerHTML = ''; 
            
            pathData.interviewQuestions.forEach(faq => {
                const item = document.createElement('div');
                item.className = 'faq-item';
                item.innerHTML = `
                    <div class="faq-question">${faq.question}</div>
                    <div class="faq-answer">
                        <p><strong>Example Answer:</strong> ${faq.answer}</p>
                        <div class="answer-feedback-container">
                             <textarea placeholder="Type your answer here..."></textarea>
                             <button class="get-feedback-btn">✨ Get Feedback</button>
                             <div class="feedback-result" style="display:none;"></div>
                        </div>
                    </div>
                `;
                faqContainer.appendChild(item);

                const saved = currentInterviewSession.find(
    q => q.question === faq.question
);

if (saved) {

    item.querySelector("textarea").value =
        saved.answer;

    const feedback =
        item.querySelector(".feedback-result");

    feedback.innerHTML =
        saved.feedback.replace(/\n/g,"<br>");

    feedback.style.display = "block";

}
            });

            showPage(interviewPage);
        }

         function handleAccordion(e) {
             if(e.target.classList.contains('faq-question')) {
                const item = e.target.parentElement;
                const answer = item.querySelector('.faq-answer');
                const wasActive = item.classList.contains('active');
                
                // Close all other items
                item.parentElement.querySelectorAll('.faq-item').forEach(i => {
                    if (i !== item) {
                        i.classList.remove('active');
                        i.querySelector('.faq-answer').style.maxHeight = '0';
                        i.querySelector('.faq-answer').style.padding = '0 20px';
                    }
                });

                if(!wasActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.padding = '15px 20px 0 20px';
                } else {
                     item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0 20px';
                }
            }
        }
        
        pathsPage.addEventListener('click', function(e){
            if(e.target.classList.contains('complete-btn')){
                const item = e.target.closest('.timeline-item');
                item.classList.toggle('completed');
                e.target.textContent = item.classList.contains('completed') ? 'Completed' : 'Mark Complete';
            }
        });
        
        interviewPage.addEventListener('click', handleAccordion);
        
        interviewPage.addEventListener('click', async function(e) {
            if(e.target.classList.contains('get-feedback-btn')) {
                console.log("Get Feedback button clicked");
                const button = e.target;
                const container = button.closest('.answer-feedback-container');
                const textarea = container.querySelector('textarea');
                const feedbackResultDiv = container.querySelector('.feedback-result');
                const question = button.closest('.faq-item').querySelector('.faq-question').textContent;
                const userAnswer = textarea.value;

                if (!userAnswer.trim()) {
                    showToast("Please enter your answer first.", "warning");
                    return;
                }

                const prompt = `As an expert interview coach, provide constructive feedback on the following answer to an interview question. Focus on clarity, structure (like the STAR method), and impact. Be encouraging. \n\nQuestion: "${question}"\n\nUser's Answer: "${userAnswer}"`;
                const payload = { contents: [{ parts: [{ text: prompt }] }] };

                const feedback = await callGeminiAPI(payload); 

                console.log("Feedback received:", feedback);
                
                if (feedback) {

    feedbackResultDiv.innerHTML = feedback.replace(/\n/g, "<br>");

    feedbackResultDiv.style.display = "block";

    currentInterviewSession.push({

    question,

    answer: userAnswer,

    feedback

});

console.log("Saving Interview...");
console.log(currentInterviewSession);

 console.log("About to call saveInterview()");

 console.log("Calling saveInterview()");

await saveInterview({

    

    careerTitle: document.getElementById("interviewTitle").innerText,

    questions: currentInterviewSession

});



                    // Adjust accordion height
                    const answerDiv = button.closest('.faq-answer');
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + feedbackResultDiv.scrollHeight + 'px';
                }
            }
        });

      
        interviewPrepBtn.addEventListener("click", async () => {

    console.log("STEP 1");

    const savedInterview = await loadInterview();

    console.log("STEP 2");

    if (savedInterview) {

        console.log("STEP 3");

        currentInterviewSession =
            savedInterview.interviewData.questions || [];

    }

    console.log("STEP 4");

    const savedPath = localStorage.getItem("careerCraftPath");

    console.log("Saved Path:", savedPath);

    if (savedPath) {

        console.log("STEP 5");

        generatedPathData = JSON.parse(savedPath);

        console.log("STEP 6");

        populateAndShowInterviewPage(generatedPathData);

        console.log("STEP 7");

    } else {

        console.log("NO PATH FOUND");

        showToast(
            "Generate a career path first to access interview preparation.",
            "warning"
        );

        showPage(assessmentPage);

    }

});
        // ======================================
// Save Interview Session
// ======================================

async function saveInterview(data) {

    console.log("========== SAVE INTERVIEW ==========");
     console.log("saveInterview() called");
    console.log(data);


    try {

        const token = Storage.get("token");

         console.log("Token:", token);

        const response = await fetch(`${CONFIG.API_BASE_URL}/interview`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "x-auth-token": token

            },

            body: JSON.stringify(data)

        });

        console.log("Interview Status:", response.status);

       


const result = await response.text();

console.log("Interview Response:", result);

if (response.ok) {
    console.log("Interview Saved Successfully");
}

        if (!response.ok) {

            throw new Error("Failed to save interview.");

        }

        console.log("Interview saved successfully.");

        showToast(
    "Interview saved successfully!",
    "success"
);

    }

    catch (err) {

        console.error(err);

        showToast("Failed to save interview.", "error");

    }

}

// ======================================
// Load Saved Interview
// ======================================

async function loadInterview() {

    try {

        const token = Storage.get("token");

        const response = await fetch(`${CONFIG.API_BASE_URL}/interview`, {

            headers: {

                "x-auth-token": token

            }

        });

        if (!response.ok) {

            return null;

        }

        return await response.json();

    }

    catch (err) {

        console.log("No Interview found.");

        return null;

    }

}