document.addEventListener("DOMContentLoaded", function() {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbotBox = document.getElementById("chatbot-box");
    const closeChat = document.getElementById("close-chat");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotInput = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("send-btn");

    // Open chatbot
    chatbotBtn.addEventListener("click", () => {
        chatbotBox.style.display = "block";
    });

    // Close chatbot
    closeChat.addEventListener("click", () => {
        chatbotBox.style.display = "none";
    });

    // Send message
    sendBtn.addEventListener("click", async () => {
        let userMessage = chatbotInput.value.trim();
        if (!userMessage) return;
    
        appendMessage("You", userMessage, true);
        chatbotInput.value = "";
    
        // Fetch AI Response
        const aiResponse = await getAIResponse(userMessage);
        appendMessage("AI", aiResponse, false);
    });
    

    function appendMessage(sender, message, isUser = false) {
        const msgElement = document.createElement("div");
        msgElement.classList.add("chat-message");
    
        if (isUser) {
            msgElement.classList.add("user-message");
        } else {
            msgElement.classList.add("ai-message");
        }
    
        msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatbotMessages.appendChild(msgElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    

        async function getAIResponse(userInput) {
            const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
            const API_KEY = "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";  // Replace with your Hugging Face API Key
            const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyhwFoDrWjU5bcC762FrIhFEaICtfRfWS3Y7ZzzVrgyFwvE4gsaAotteh3Ir85oQSah/exec";  // Replace with your Google Web App URL
        
            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ inputs: userInput })
                });
        
                const data = await response.json();
                let aiResponse = data.generated_text || "Sorry, I couldn't understand that.";
        
                // Send Data to Google Sheets
                fetch(GOOGLE_SHEET_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userMessage: userInput,
                        aiResponse: aiResponse
                    })
                });
        
                return aiResponse;
        
            } catch (error) {
                console.error("Error fetching AI response:", error);
                return "Error connecting to AI.";
            }
        }

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyhwFoDrWjU5bcC762FrIhFEaICtfRfWS3Y7ZzzVrgyFwvE4gsaAotteh3Ir85oQSah/exec" 

    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();  // Prevents form from refreshing the page
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Send Contact Form Data to Google Sheets
        fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                contactMessage: message
            })
        })
        .then(response => response.text())  // Get raw response
        .then(data => {
            console.log("Google Sheets Response:", data);
            if (data.includes("Success")) {
                alert("Message sent successfully!");
                contactForm.reset();
            } else {
                alert("Error sending message: " + data);
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            alert("Something went wrong. Please check the console.");
        });
        
    });
});
});
