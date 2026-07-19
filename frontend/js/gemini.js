async function callGeminiAPI(payload) {

    loadingModal.style.display = "flex";

    try {

        const response = await fetch(`${CONFIG.API_BASE_URL}/ai/chat`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                prompt: payload.contents[0].parts[0].text

            })

        });

        const result = await response.json();

console.log("Groq Response:", result);

if (!response.ok) {
    throw new Error(result.message || "AI Request Failed");
}

loadingModal.style.display = "none";

let text = result.response;

console.log("AI Text:", text);

if (!text) {
    throw new Error("No response returned from AI.");
}

text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

try {
    return JSON.parse(text);
}
catch {
    return text;
}

    }

    catch (err) {

        loadingModal.style.display = "none";

        console.error(err);

        showToast(err.message, "error");

        return null;

    }

}