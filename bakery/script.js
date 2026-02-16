// Chatbot stuff

const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatToggle = document.getElementById('chatToggle');
const chatbotWrapper = document.getElementById('chatbotWrapper');
const minimizeBtn = document.getElementById('minimizeBtn');
const chatIcon = chatToggle.querySelector('.chat-icon');
const closeIcon = chatToggle.querySelector('.close-icon');

let messageId = 1;
let isTyping = false;
let isOpen = false;

// Toggle chatbot open/dicht
chatToggle.addEventListener('click', function() {
    if (isOpen) {
        chatbotWrapper.style.display = 'none';
        chatIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        isOpen = false;
    } else {
        chatbotWrapper.style.display = 'block';
        chatIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        isOpen = true;
    }
});

// Minimize button
minimizeBtn.addEventListener('click', function() {
    chatbotWrapper.style.display = 'none';
    chatIcon.style.display = 'block';
    closeIcon.style.display = 'none';
    isOpen = false;
});

// Update tijd bij opstarten
updateMessageTimes();

// Textarea groeit automatisch mee
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    sendButton.disabled = !this.value.trim() || isTyping;
});

// Enter = verzenden (Shift+Enter = nieuwe regel)
messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

// Verstuur bericht
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText || isTyping) return;
    
    addMessage(messageText, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendButton.disabled = true;
    showTypingIndicator();
    
    // Stuur naar PHP backend
    sendMessageToBackend(messageText).then(response => {
        hideTypingIndicator();
        addMessage(response, 'bot');
    }).catch(error => {
        hideTypingIndicator();
        addMessage("Sorry, er ging iets mis. Probeer het opnieuw.", 'bot');
    });
}

// Voeg bericht toe
function addMessage(text, sender) {
    messageId++;
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${sender}`;
    
    const message = document.createElement('div');
    message.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender === 'user' ? 'user-avatar' : ''}`;
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    
    if (sender === 'user') {
        message.appendChild(messageContent);
        message.appendChild(avatar);
    } else {
        message.appendChild(avatar);
        message.appendChild(messageContent);
    }
    
    messageWrapper.appendChild(message);
    messagesContainer.appendChild(messageWrapper);
    scrollToBottom();
}

// Laat zien dat bot aan het typen is
function showTypingIndicator() {
    isTyping = true;
    sendButton.disabled = true;
    
    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'message-wrapper bot';
    typingWrapper.id = 'typingIndicator';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        typingIndicator.appendChild(span);
    }
    
    typingWrapper.appendChild(typingIndicator);
    messagesContainer.appendChild(typingWrapper);
    
    scrollToBottom();
}

// Stop typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    sendButton.disabled = !messageInput.value.trim();
}

// Scroll naar beneden
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Huidige tijd
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update tijden bij start
function updateMessageTimes() {
    const timeElements = document.querySelectorAll('.message-time');
    timeElements.forEach(el => {
        if (!el.textContent) {
            el.textContent = getCurrentTime();
        }
    });
}

// Stuurt bericht naar PHP backend
async function sendMessageToBackend(message) {
    try {
        const response = await fetch('api/chat.php', {//deze (api/chat.php)veranderen naar de index.php of wa dan ook 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, kan niet verbinden met de server. Probeer het later opnieuw.";
    }
}


