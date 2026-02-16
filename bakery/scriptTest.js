const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatToggle = document.getElementById('chatToggle');
const chatbotWrapper = document.getElementById('chatbotWrapper');
const minimizeBtn = document.getElementById('minimizeBtn');
const chatIcon = chatToggle.querySelector('.chat-icon');
const closeIcon = chatToggle.querySelector('.close-icon');
const clearChatBtn = document.getElementById('clearChatBtn');

let isTyping = false;
let isOpen = false;

chatToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatbotWrapper.style.display = isOpen ? 'flex' : 'none';
    chatIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
});

minimizeBtn.addEventListener('click', () => {
    chatbotWrapper.style.display = 'none';
    chatIcon.style.display = 'block';
    closeIcon.style.display = 'none';
    isOpen = false;
});

messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
    sendButton.disabled = !messageInput.value.trim();
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage();
    }
});

sendButton.addEventListener('click', sendUserMessage);

function addMessage(text, sender, options = []) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${sender}`;

    const message = document.createElement('div');
    message.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender === 'user' ? 'user-avatar' : ''}`;
    avatar.textContent = sender === 'user' ? '👤' : '🤖';

    const content = document.createElement('div');
    content.className = "message-content";

    const p = document.createElement('p');
    p.textContent = text;

    const time = document.createElement('span');
    time.className = "message-time";
    time.textContent = getCurrentTime();

    content.appendChild(p);
    content.appendChild(time);

    if (options.length > 0 && sender === 'bot') {
        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'options-wrapper';

        options.forEach(optionText => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = optionText;

            btn.addEventListener('click', () => {
                messageInput.value = optionText;
                sendUserMessage();
            });

            buttonsWrapper.appendChild(btn);
        });

        content.appendChild(buttonsWrapper);
    }

    if (sender === 'user') {
        message.appendChild(content);
        message.appendChild(avatar);
    } else {
        message.appendChild(avatar);
        message.appendChild(content);
    }

    wrapper.appendChild(message);
    messagesContainer.appendChild(wrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Typing indicator
function showTypingIndicator() {
    isTyping = true;
    const wrapper = document.createElement('div');
    wrapper.className = "message-wrapper bot";
    wrapper.id = "typingIndicator";
    wrapper.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    messagesContainer.appendChild(wrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    document.getElementById('typingIndicator')?.remove();
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

const chatbotKeywords = [
    {
        keywords: ["allergie", "allergieen", "voedsel","eten", "noten", "melk"],
        antwoord: "Ja ons voedsel kan sporen van noten en melk bevatten. Heb je een allergie, laat het weten aan onze medewerkers.",
        options: ["Ja, ik heb een notenallergie", "Nee, ik heb geen allergie"]
    },
    {
        keywords: ["rapporteren", "klacht", "bericht", "aanmelden", "probleem", "feedback"],
        antwoord: "Als je iemand wilt rapporteren kan je ons online een bericht sturen of kan je bij de receptie het aanmelden.",
        options: ["Online bericht sturen", "Receptie melden"]
    },
    {
        keywords: ["koffiemachine", "koffieapparaat", "koffie", "drank", "espresso"],
        antwoord: "Zet een beker in de koffiemachine en klik op het scherm en selecteer wat voor soort koffie u wilt.",
        options: ["Espresso", "Cappuccino", "Latte"]
    },
    {
        keywords:["uitchecken", "checkout", "afronden", "afsluiten", "vertrekken"],
        antwoord: "Het restaurant sluit om 8 uur in weekdagen en 10 uur in het weekend. Zorg ervoor dat u een half uur eerder uitcheckt.",
        options: ["Hoe laat is uitchecken?", "Kan ik later uitchecken?"]
    },
    {
        keywords:["reservatie", "reservaties", "reservering", "boeking", "tafel", "boek"],
        antwoord: "Ja natuurlijk! Het maximum voor een persoon die komt met een groep is 12 personen inclusief uzelf.",
        options: ["Reserveer een tafel", "Wat is de capaciteit?"]
    },
    {
        keywords:["menu", "eten", "gerechten", "lunch", "diner"],
        antwoord: "U kunt ons menu bekijken op de website of ik kan u enkele suggesties geven.",
        options: ["Laat me het menu zien", "Wat zijn de specials?"]
    },
    {
        keywords:["openingstijd", "open", "uren", "tijd"],
        antwoord: "Ons restaurant is geopend van 8:00 tot 22:00 op weekdagen en van 10:00 tot 22:00 in het weekend.",
        options: ["Openingstijden", "Weekenduren"]
    },
    {
        keywords:["contact", "telefoon", "email", "adres"],
        antwoord: "U kunt contact met ons opnemen via info@restaurant.nl of bellen naar 012-3456789.",
        options: ["Email", "Telefoon"]
    },
    {
        keywords:["wifi", "internet", "verbinding"],
        antwoord: "Er is gratis Wi-Fi beschikbaar. Het wachtwoord staat op uw tafelkaart.",
        options: ["Wat is het wachtwoord?", "Waar vind ik Wi-Fi?"]
    }
];

function sendUserMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    messageInput.value = '';
    sendButton.disabled = true;

    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();

        const userText = text.toLowerCase();
        let response = "Sorry, dat begrijp ik niet helemaal. Kun je je vraag anders formuleren?";
        let options = [];

        chatbotKeywords.some(item => {
            return item.keywords.some(keyword => {
                if (userText.includes(keyword)) {
                    response = item.antwoord;
                    if (item.options) options = item.options;
                    return true;
                }
                return false;
            });
        });

        addMessage(response, 'bot', options);
    }, 800);
}

clearChatBtn.addEventListener('click', () => {
    if (confirm('Weet je zeker dat je de chat wilt wissen?')) {
        messagesContainer.innerHTML = '';
        addMessage('Hallo! Waarmee kan ik je helpen?', 'bot');
        isTyping = false;
    }
});

window.addEventListener('load', () => {
    addMessage('Hallo! Waarmee kan ik je helpen?', 'bot', ["Menu bekijken", "Reservatie maken", "Openingstijden"]);
});
