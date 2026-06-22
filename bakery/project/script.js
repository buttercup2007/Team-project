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

        const input = text.toLowerCase();

        /* RESERVATION FLOW FIRST */
        if (
            reservationState ||
            input.includes("reserver") ||
            input.includes("booking") ||
            input.includes("reservatie") ||
            input.includes("reservering") ||
            input.includes("tafel") ||
            input.includes("booking")

        ) {
            if (handleReservation(text)) return;
        }

        /* NORMAL RESPONSES */
        const responses = [
            {
                keywords: ["menu", "eten", "kaart", "gerechten"],
                answer: "Ons menu bevat verse broodjes, taarten en drankjes."
            },
            {
                keywords: ["opening", "open", "tijd"],
                answer: "Wij zijn open van 08:00 tot 22:00."
            },
            {
                keywords: ["contact", "email", "telefoon"],
                answer: "Je kan ons bereiken via info@restaurant.nl"
            },
            {
                keywords: ["wifi", "internet"],
                answer: "Wij hebben gratis WiFi in het hele restaurant."
            }
        ];

        for (const r of responses) {
            if (r.keywords.some(k => input.includes(k))) {
                addMessage(r.answer, 'bot');
                return;
            }
        }

        addMessage("Sorry, dat begrijp ik niet helemaal. Kun je het anders zeggen?", 'bot');

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

/* -- MESSAGES -- */

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