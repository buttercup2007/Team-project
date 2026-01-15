const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatToggle = document.getElementById('chatToggle');
const chatbotWrapper = document.getElementById('chatbotWrapper');
const minimizeBtn = document.getElementById('minimizeBtn');
const chatIcon = chatToggle.querySelector('.chat-icon');
const closeIcon = chatToggle.querySelector('.close-icon');

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

function addMessage(text, sender) {
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
        keywords: ["allergie", "allergieen", "voedsel","eten"],
        antwoord: "Ja ons voedsel kan sporen van noten en melk bevatten. Heb je een allergie, laat het weten aan onze medewerkers."
    },

    {
        keywords: ["rapporteren", "klacht", "bericht", "aanmelden"],
        antwoord: "Als je iemand wilt rapporteren kan je ons online een bericht sturen of kan je bij de receptie het aanmelden."
    },

    {
        keywords: ["koffiemachine", "koffieapparaat", "koffie"],
        antwoord: "Zet een beker in de koffiemachine en klik op het scherm en selecteer wat voor soort coffee u wilt."
    },

    {
        keywords:["uitchecken", "checkout", "afronden", "afsluiten"],
        antwoord: "Het restaurant sluit om 8 uur in week dagen en 10 uur op weekends. Zorg ervoor dat u een half uur eerder uitcheckt."
    },

    {
        keywords:["reservatie", "reservaties", "reservering", "boeking"],
        antwoord: "Ja natuurlijk! Het maximum voor een persoon die komt met een groep is 12 personen inclusief uzelf."
    }
]

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

        chatbotKeywords.some(item => {
            return item.keywords.some(keyword => {
                if (userText.includes(keyword)) {
                    response = item.antwoord;
                    return true;
                }
                return false;
            });
        });

        addMessage(response, 'bot');
    }, 800);
}



window.addEventListener('load', () => {
    showNextQuestion();
});
