<?php
session_start();

if (!isset($_SESSION['login'])) {
    $_SESSION['login'] = true;
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
        <span class="close-icon" style="display:none;">✕</span>
    </button>

    <!-- Clear Chat -->
    <button id="clearChatBtn" title="Clear chat">
        Delete
    </button>

    <!-- Chat Widget -->
    <div class="chatbot-wrapper" id="chatbotWrapper" style="display:none;">
        <div class="chatbot-container">

            <div class="chatbot-header">
                <div class="header-content">
                    <div class="bot-avatar">🤖</div>

                    <div class="header-info">
                        <h1>Chatbot</h1>
                    </div>
                </div>

                <!-- Optional minimize button -->
                <button id="minimizeBtn">−</button>
            </div>

            <!-- IMPORTANT: Empty container -->
            <div class="chatbot-messages" id="messagesContainer"></div>

            <div class="chatbot-input-container">
                <div class="input-wrapper">

                    <textarea
                        id="messageInput"
                        class="chatbot-input"
                        placeholder="Typ je bericht..."
                        rows="1"
                    ></textarea>

                    <button
                        id="sendButton"
                        class="send-button"
                        disabled
                    >
                        Send
                    </button>

                </div>
            </div>

        </div>
    </div>

    <script src="scriptTest.js"></script>

</body>
</html>