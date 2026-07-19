const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Test Route
router.get("/chat", (req, res) => {
    res.send("AI Route Working");
});

// AI Route
router.post("/chat", async (req, res) => {

    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        let systemPrompt =
            "You are an expert AI assistant. Reply only with the requested output.";

        // Resume
        if (
            prompt.toLowerCase().includes("resume") ||
            prompt.toLowerCase().includes('"experience"') ||
            prompt.toLowerCase().includes('"education"')
        ) {

            systemPrompt = `
You are an ATS Resume Generator.

Return ONLY VALID JSON.

Do NOT use markdown.

Do NOT explain anything.

Do NOT write sentences before or after the JSON.

Return exactly this structure:

{
"name":"",
"title":"",
"email":"",
"phone":"",
"location":"",
"summary":"",
"experience":[
{
"jobTitle":"",
"company":"",
"dates":"",
"description":""
}
],
"education":[
{
"degree":"",
"school":""
}
],
"skills":[]
}
`;
        }

        // Career Ideas
        else if (prompt.includes("career path ideas")) {

            systemPrompt = `
Return ONLY JSON.

{
"careers":[
{
"title":"",
"description":""
}
]
}
`;
        }

        // Career Path
        else if (prompt.includes("personalized career path")) {

            systemPrompt = `
Return ONLY JSON.

{
"skillsNeed":[],
"milestones":[],
"interviewQuestions":[],
"skillTree":[]
}
`;
        }

        // Job Recommendations
else if (prompt.includes("job recommendations")) {

    systemPrompt = `
Return ONLY VALID JSON.

{
"jobs":[
{
"title":"",
"company":"",
"location":"",
"salary":"",
"experience":"",
"skills":[],
"url":""
}
]
}

Rules:

Generate exactly 6 jobs.

Choose companies that commonly hire for this role.

Location should be realistic.

Salary should be realistic.

Experience should be 0-2 years.

Skills should contain 4-6 skills.

The URL should be the company's careers page.

Do not write anything except JSON.
`;
}

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            temperature: 0.2,

            messages: [

                {
                    role: "system",
                    content: systemPrompt
                },

                {
                    role: "user",
                    content: prompt
                }

            ]

        });

        let text = completion.choices[0].message.content;

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        res.json({

            success: true,

            response: text

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;