<?php
session_start();

// Temporary: allow access without login
// $_SESSION['login'] = true; // uncomment to auto-login

if (!isset($_SESSION['login'])) { 
    echo "Access denied. Skipping login for testing...";
    $_SESSION['login'] = true; // auto-set login
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Floating Chat Button -->
    <button id="chatToggle" class="chat-toggle">
        <span class="chat-icon">💬</span>
        <span class="close-icon" style="display: none;">✕</span>
    </button>

    <button id="clearChatBtn" title="Clear chat">delete</button>


    <!-- Chatbot Widget -->
    <div class="chatbot-wrapper" id="chatbotWrapper" style="display: none;">
        <div class="chatbot-container">
            <div class="chatbot-header">
                <div class="header-content">
                    <div class="bot-avatar">🤖</div>
                    <div class="header-info">
                        <h1>Chatbot</h1>
                    </div>
                    <button class="minimize-btn" id="minimizeBtn">💬</button>
                </div>
            </div>

            <div class="chatbot-messages" id="messagesContainer">
                <div class="message-wrapper bot">
                    <div class="message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p>Hallo! Hoe kan ik je helpen?</p>
                            <span class="message-time"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chatbot-input-container">
                <div class="input-wrapper">
                    <textarea
                        id="messageInput"
                        class="chatbot-input"
                        placeholder="Typ je berichten..."
                        rows="1"
                    ></textarea>
                    <button id="sendButton" class="send-button" disabled>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="scriptTest.js"></script>
</body>
</html>
