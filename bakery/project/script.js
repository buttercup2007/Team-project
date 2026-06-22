/* -- DOM -- */
console.log("NEW SCRIPT.JS IS RUNNING");

const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatToggle = document.getElementById('chatToggle');
const chatbotWrapper = document.getElementById('chatbotWrapper');
const minimizeBtn = document.getElementById('minimizeBtn');

const chatIcon = chatToggle.querySelector('.chat-icon');
const closeIcon = chatToggle.querySelector('.close-icon');

/* -- STATE -- */

let isOpen = false;
let isTyping = false;

let reservationState = null;
let reservationData = {
    people: "",
    date: "",
    time: ""
};

/* -- INTENT DETECTION -- */

function detectIntent(input) {
    const text = input.toLowerCase();

    const reservationKeywords = [
        "reservatie", "reserveren", "reservering",
        "tafel", "booking", "afspraak",
        "ik wil een tafel", "tafel reserveren"
    ];

    const menuKeywords = [
        "menu", "eten", "kaart", "gerechten", "wat hebben jullie"
    ];

    const contactKeywords = [
        "contact", "email", "telefoon", "bereiken"
    ];

    const wifiKeywords = [
        "wifi", "internet"
    ];

    if (reservationKeywords.some(k => text.includes(k))) return "reservation";
    if (menuKeywords.some(k => text.includes(k))) return "menu";
    if (contactKeywords.some(k => text.includes(k))) return "contact";
    if (wifiKeywords.some(k => text.includes(k))) return "wifi";

    return "unknown";
}

/* -- CHAT OPEN / CLOSE -- */

chatToggle.addEventListener('click', () => {
    isOpen = !isOpen;

    chatbotWrapper.style.display = isOpen ? 'flex' : 'none';
    chatIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
});

minimizeBtn?.addEventListener('click', () => {
    chatbotWrapper.style.display = 'none';
    isOpen = false;

    chatIcon.style.display = 'block';
    closeIcon.style.display = 'none';
});

/* -- INPUT -- */

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

/* -- SEND MESSAGE -- */

function sendUserMessage() {
    const text = messageInput.value.trim();
    if (!text || isTyping) return;

    addMessage(text, 'user');

    messageInput.value = '';
    sendButton.disabled = true;

    showTyping();

    setTimeout(() => {
        hideTyping();

        const intent = detectIntent(text);

        /* RESERVATION FLOW */
        if (intent === "reservation" || reservationState) {
            handleReservation(text);
            return;
        }

        /* MENU */
        if (intent === "menu") {
            addMessage("Ons menu bevat verse broodjes, taarten en drankjes.", "bot");
            return;
        }

        /* CONTACT */
        if (intent === "contact") {
            addMessage("Je kan ons bereiken via info@restaurant.nl", "bot");
            return;
        }

        /* WIFI */
        if (intent === "wifi") {
            addMessage("Wij hebben gratis WiFi in het hele restaurant.", "bot");
            return;
        }

        /* FALLBACK */
        addMessage("Sorry, ik begrijp je vraag niet helemaal. Kun je het anders formuleren?", "bot");

    }, 600);
}

/* -- RESERVATION FLOW -- */

function handleReservation(input) {

    if (!reservationState) {
        reservationState = "people";
        addMessage("Voor hoeveel personen is de reservatie?", "bot");
        return true;
    }

    if (reservationState === "people") {
        reservationData.people = input;
        reservationState = "date";
        addMessage("Welke datum wil je reserveren?", "bot");
        return true;
    }

    if (reservationState === "date") {
        reservationData.date = input;
        reservationState = "time";
        addMessage("Hoe laat wil je komen?", "bot");
        return true;
    }

    if (reservationState === "time") {

        reservationData.time = input;

        addMessage(
            `Reservatie bevestigd voor ${reservationData.people} personen op ${reservationData.date} om ${reservationData.time}.`,
            "bot"
        );

        reservationState = null;
        reservationData = { people: "", date: "", time: "" };

        return true;
    }
}

/* -- MESSAGE SYSTEM -- */

function addMessage(text, sender) {

    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${sender}`;

    const message = document.createElement('div');
    message.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';

    const content = document.createElement('div');
    content.className = 'message-content';

    const p = document.createElement('p');
    p.textContent = text;

    const time = document.createElement('span');
    time.className = 'message-time';

    const now = new Date();
    time.textContent = now.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });

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

/* -- TYPING -- */

function showTyping() {
    isTyping = true;

    const div = document.createElement('div');
    div.className = 'message-wrapper bot';
    div.id = 'typing';

    div.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;

    messagesContainer.appendChild(div);
}

function hideTyping() {
    isTyping = false;
    document.getElementById('typing')?.remove();
}

/* -- INIT -- */

window.addEventListener('load', () => {
    addMessage("Hallo! Waarmee kan ik je helpen?", "bot");
});