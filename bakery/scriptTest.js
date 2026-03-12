const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatToggle = document.getElementById("chatToggle");
const chatbotWrapper = document.getElementById("chatbotWrapper");
const minimizeBtn = document.getElementById("minimizeBtn");
const clearChatBtn = document.getElementById("clearChatBtn");

const chatIcon = chatToggle?.querySelector(".chat-icon");
const closeIcon = chatToggle?.querySelector(".close-icon");

let isOpen = false;

/* open close chat */

chatToggle?.addEventListener("click", () => {
  isOpen = !isOpen;

  chatbotWrapper.style.display = isOpen ? "flex" : "none";

  if (chatIcon) chatIcon.style.display = isOpen ? "none" : "block";
  if (closeIcon) closeIcon.style.display = isOpen ? "block" : "none";
});

minimizeBtn?.addEventListener("click", () => {
  chatbotWrapper.style.display = "none";

  if (chatIcon) chatIcon.style.display = "block";
  if (closeIcon) closeIcon.style.display = "none";

  isOpen = false;
});

/* invoerverwerking */

messageInput?.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = messageInput.scrollHeight + "px";

  sendButton.disabled = !messageInput.value.trim();
});

messageInput?.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendUserMessage();
  }
});

sendButton?.addEventListener("click", sendUserMessage);

/* message rendering */

function addMessage(text, sender, options = []) {
  const wrapper = document.createElement("div");
  wrapper.className = `message-wrapper ${sender}`;

  const message = document.createElement("div");
  message.className = `message ${sender}-message`;

  const avatar = document.createElement("div");
  avatar.className = `message-avatar ${sender === "user" ? "user-avatar" : ""}`;
  avatar.textContent = sender === "user" ? "👤" : "🤖";

  const content = document.createElement("div");
  content.className = "message-content";

  const p = document.createElement("p");
  p.textContent = text;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = getCurrentTime();

  content.appendChild(p);
  content.appendChild(time);

  if (options.length && sender === "bot") {
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "options-wrapper";

    options.forEach(option => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        messageInput.value = option;
        sendUserMessage();
      });

      buttonsWrapper.appendChild(btn);
    });

    content.appendChild(buttonsWrapper);
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

/* TYPING INDICATOR*/

function showTypingIndicator() {
  if (document.getElementById("typingIndicator")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "message-wrapper bot";
  wrapper.id = "typingIndicator";

  wrapper.innerHTML = `
  <div class="typing-indicator">
  <span></span><span></span><span></span>
  </div>
  `;

  messagesContainer.appendChild(wrapper);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

/* tijdstip */

function getCurrentTime() {
  return new Date().toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* chatbot beantwoorden */

const chatbotKeywords = [
  {
    keywords: ["allergie", "noten", "melk", "voedsel"],
    antwoord:
      "Ja, ons voedsel kan sporen van noten en melk bevatten. Laat het weten aan onze medewerkers als u allergieën heeft."
  },
  {
    keywords: ["rapporteren", "klacht", "probleem", "feedback"],
    antwoord:
      "Als je iemand wilt rapporteren kan je ons online een bericht sturen of dit melden bij de receptie."
  },
  {
    keywords: ["koffie", "koffiemachine", "espresso"],
    antwoord:
      "Plaats een beker in de koffiemachine en kies op het scherm welke koffie u wilt."
  },
  {
    keywords: ["uitchecken", "checkout", "vertrekken"],
    antwoord:
      "Het restaurant sluit om 20:00 op weekdagen en 22:00 in het weekend."
  },
  {
    keywords: ["reservatie", "reservering", "boeking", "tafel"],
    antwoord:
      "Ja! Het maximum voor een groep is 12 personen inclusief uzelf."
  },
  {
    keywords: ["menu", "eten", "gerechten"],
    antwoord:
      "U kunt ons menu bekijken op de website of ik kan enkele suggesties geven."
  },
  {
    keywords: ["openingstijd", "open", "uren"],
    antwoord:
      "Ons restaurant is geopend van 08:00 tot 22:00 op weekdagen en 10:00 tot 22:00 in het weekend."
  },
  {
    keywords: ["contact", "telefoon", "email", "adres"],
    antwoord:
      "U kunt ons bereiken via info@restaurant.nl of bellen naar 012-3456789."
  },
  {
    keywords: ["wifi", "internet"],
    antwoord:
      "Er is gratis Wi-Fi beschikbaar. Het wachtwoord staat op uw tafelkaart."
  }
];

/* bericht sturen*/

function sendUserMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, "user");

  messageInput.value = "";
  messageInput.style.height = "auto";
  sendButton.disabled = true;

  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();

    const userText = text.toLowerCase();
    let response =
      "Sorry, dat begrijp ik niet helemaal. Kun je je vraag anders formuleren?";

    chatbotKeywords.some(item => {
      return item.keywords.some(keyword => {
        if (userText.includes(keyword)) {
          response = item.antwoord;
          return true;
        }
      });
    });

    addMessage(response, "bot");
  }, 700);
}

/* chat wissen */

clearChatBtn?.addEventListener("click", () => {
  if (!confirm("Weet je zeker dat je de chat wilt wissen?")) return;

  messagesContainer.innerHTML = "";
  addMessage("Hallo! Waarmee kan ik je helpen?", "bot");
});

/* init */

window.addEventListener("load", () => {
  addMessage("Hallo! Waarmee kan ik je helpen?", "bot", [
    "Menu bekijken",
    "Reservatie maken",
    "Openingstijden"
  ]);
});