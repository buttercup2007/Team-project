/* -- DOM -- */

const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatToggle = document.getElementById('chatToggle');
const chatbotWrapper = document.getElementById('chatbotWrapper');
const minimizeBtn = document.getElementById('minimizeBtn');

const chatIcon = chatToggle.querySelector('.chat-icon');
const closeIcon = chatToggle.querySelector('.close-icon');

const STORAGE_KEY = "chatbot_messages";

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
    if (window.waitingForClearConfirm) {
    const text = messageInput.value.trim().toLowerCase();

    if (input === "ja" || input === "yes") {
        messagesContainer.innerHTML = "";
        localStorage.removeItem(STORAGE_KEY);

        window.waitingForClearConfirm = false;

        addMessage("Chat geschiedenis verwijderd.", "bot");
        return;
    }

    if (input === "nee" || input === "no") {
        window.waitingForClearConfirm = false;
        addMessage("Oké, ik heb niets verwijderd.", "bot");
        return;
    }

    addMessage("Typ 'ja' of 'nee'.", "bot");
    return;
}
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

function addMessage(text, sender, save = true) {

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

    if (save) saveChat();
}

function saveChat() {
    const messages = [];

    document.querySelectorAll('.message-wrapper').forEach(wrapper => {
        const text = wrapper.querySelector('p')?.textContent;
        const sender = wrapper.classList.contains('user') ? 'user' : 'bot';

        if (text) {
            messages.push({ text, sender });
        }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function loadChat() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;

    const messages = JSON.parse(data);

    messages.forEach(msg => {
        addMessage(msg.text, msg.sender, false);
    });
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

const clearChatBtn = document.getElementById('clearChatBtn');

clearChatBtn.addEventListener('click', () => {
    const confirmDelete = confirm("Weet je zeker dat je de chat wilt verwijderen?");

    if (confirmDelete) {
        messagesContainer.innerHTML = "";
        localStorage.removeItem(STORAGE_KEY);

        addMessage("Chat is verwijderd.", "bot");
    }
});

/* -- INIT -- */

window.addEventListener('load', () => {
    loadChat();

    // alleen welcome als er nog niks is
    if (messagesContainer.children.length === 0) {
        addMessage("Hallo! Waarmee kan ik je helpen?", "bot");
    }
});