document.addEventListener("DOMContentLoaded", async () => {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    let aiResponses = {};

    try {
        const response = await fetch("romulus-v0.json");
        if (response.ok) {
            aiResponses = await response.json();
            typeBotMessage("Welcome to Romulus, the superior AI. Don't waste my time.");
        } else {
            typeBotMessage("Failed to load the response data. I suggest you try again later.");
        }
    } catch (error) {
        console.error("Error fetching JSON:", error);
        typeBotMessage("Error fetching the response data. Something went wrong.");
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", event => {
        if (event.key === "Enter") sendMessage();
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage(message, "user");
        userInput.value = "";

        const response = await generateSmartResponse(message);
        setTimeout(() => typeBotMessage(response), getTypingDelay(message));
    }

    function appendMessage(text, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");

        if (sender === "bot") {
            const img = document.createElement("img");
            img.src = "https://dewanmukto.github.io/asset/images/roman.png";
            img.alt = "Romulus";
            messageElement.appendChild(img);
        }

        messageElement.innerText = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function typeBotMessage(message) {
        const botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot-message");

        const img = document.createElement("img");
        img.src = "https://dewanmukto.github.io/asset/images/roman.png";
        img.alt = "Romulus";
        botMessage.appendChild(img);

        const textDiv = document.createElement("div");
        botMessage.appendChild(textDiv);

        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        let words = message.split(" ");
        let index = 0;

        function type() {
            if (index < words.length) {
                textDiv.innerHTML += words[index] + " ";
                index++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    async function generateSmartResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        return findResponse(lowerMessage);
    }

    function findResponse(message) {
        if (Object.keys(aiResponses).length === 0) {
            return "Oops, it seems I’m still loading. Please give me a moment.";
        }

        for (const category in aiResponses) {
            for (const key in aiResponses[category]) {
                if (message.includes(key)) {
                    const responses = aiResponses[category][key];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }

        return "You dare ask *me* that? Oh, how charming. Do you wish for an answer, or are you simply wasting my time, as most do?";
    }

    function getTypingDelay(message) {
        return Math.min(1000 + message.length * 30, 3000);
    }
});
