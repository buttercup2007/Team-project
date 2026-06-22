/* -- DOM -- */

const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatToggle = document.getElementById("chatToggle");
const chatbotWrapper = document.getElementById("chatbotWrapper");
const minimizeBtn = document.getElementById("minimizeBtn");
const clearChatBtn = document.getElementById("clearChatBtn");

const chatIcon = chatToggle?.querySelector(".chat-icon");
const closeIcon = chatToggle?.querySelector(".close-icon");

/* -- STATE -- */

let isOpen = false;

let reservationState = null;

let reservationData = {
  people: "",
  date: "",
  time: ""
};

/* -- CHAT OPEN / CLOSE -- */

chatToggle?.addEventListener("click", () => {
  isOpen = !isOpen;

  chatbotWrapper.style.display = isOpen ? "flex" : "none";

  if (chatIcon) chatIcon.style.display = isOpen ? "none" : "block";
  if (closeIcon) closeIcon.style.display = isOpen ? "block" : "none";
});

minimizeBtn?.addEventListener("click", () => {
  chatbotWrapper.style.display = "none";
  isOpen = false;

  if (chatIcon) chatIcon.style.display = "block";
  if (closeIcon) closeIcon.style.display = "none";
});

/* -- INPUT -- */

messageInput?.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = messageInput.scrollHeight + "px";
  sendButton.disabled = !messageInput.value.trim();
});

messageInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendUserMessage();
  }
});

sendButton?.addEventListener("click", sendUserMessage);

/* -- HELPERS: SMART MATCH -- */

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[?!.]/g, " ");
}

function matchKeywords(input, keywords) {
  return keywords.some((k) =>
    input.includes(k) || input.split(" ").includes(k)
  );
}

/* -- RESPONSES -- */

const responses = [
  {
    keywords: ["menu", "eten", "gerechten", "kaart", "wat hebben jullie"],
    answer: "Ons menu bevat verse broodjes, taarten en drankjes.",
    options: ["Brood", "Taarten", "Dranken"]
  },
  {
    keywords: ["opening", "open", "tijd", "wanneer open", "openingsuren"],
    answer: "Wij zijn open van 08:00 tot 22:00 (weekdagen) en 10:00 tot 22:00 (weekend)."
  },
  {
    keywords: ["contact", "telefoon", "email", "bereiken"],
    answer: "Je kan ons bereiken via info@restaurant.nl of 012-3456789."
  },
  {
    keywords: ["wifi", "internet"],
    answer: "Gratis Wi-Fi beschikbaar in het hele restaurant."
  }
];

/* -- RESERVATION TRIGGERS -- */

const reservationTriggers = [
  "reservatie",
  "reserveren",
  "reserve",
  "tafel",
  "boek",
  "booking",
  "afspraak"
];

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
      `Top! Reservatie bevestigd voor ${reservationData.people} personen op ${reservationData.date} om ${reservationData.time}.`,
      "bot"
    );

    reservationState = null;
    reservationData = { people: "", date: "", time: "" };

    return true;
  }
}

/* -- SEND MESSAGE -- */

function sendUserMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const input = normalize(text);

  addMessage(text, "user");

  messageInput.value = "";
  messageInput.style.height = "auto";
  sendButton.disabled = true;

  showTyping();

  setTimeout(() => {
    hideTyping();

    /* RESERVATION FIRST */
    if (
      reservationState ||
      reservationTriggers.some((k) => input.includes(k))
    ) {
      if (handleReservation(text)) return;
    }

    /* NORMAL RESPONSES */
    for (const item of responses) {
      if (matchKeywords(input, item.keywords)) {
        addMessage(item.answer, "bot", item.options || []);
        return;
      }
    }

    addMessage(
      "Sorry, dat begrijp ik niet helemaal. Kun je het anders formuleren?",
      "bot"
    );

  }, 600);
}

/* -- MESSAGE SYSTEM -- */

function addMessage(text, sender, options = []) {
  const wrapper = document.createElement("div");
  wrapper.className = `message-wrapper ${sender}`;

  const message = document.createElement("div");
  message.className = `message ${sender}-message`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = sender === "user" ? "👤" : "🤖";

  const content = document.createElement("div");
  content.className = "message-content";

  const p = document.createElement("p");
  p.textContent = text;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = new Date().toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  });

  content.appendChild(p);
  content.appendChild(time);

  /* OPTIONS */
  if (sender === "bot" && options.length) {
    const wrap = document.createElement("div");
    wrap.className = "options-wrapper";

    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      btn.onclick = () => {
        messageInput.value = opt;
        sendUserMessage();
      };

      wrap.appendChild(btn);
    });

    content.appendChild(wrap);
  }

  if (sender === "user") {
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
  if (document.getElementById("typing")) return;

  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message-wrapper bot";

  typing.innerHTML = `
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `;

  messagesContainer.appendChild(typing);
}

function hideTyping() {
  document.getElementById("typing")?.remove();
}

/* -- CLEAR CHAT -- */

clearChatBtn?.addEventListener("click", () => {
  if (!confirm("Chat wissen?")) return;

  messagesContainer.innerHTML = "";

  reservationState = null;
  reservationData = { people: "", date: "", time: "" };

  addMessage("Hallo! Waarmee kan ik je helpen?", "bot", [
    "Menu",
    "Reservatie",
    "Openingstijden"
  ]);
});

/* -- INIT -- */

window.addEventListener("load", () => {
  addMessage("Hallo! Waarmee kan ik je helpen?", "bot", [
    "Menu",
    "Reservatie",
    "Openingstijden"
  ]);
});