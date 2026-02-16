<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

// Preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Alleen POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['response' => 'Methode niet toegestaan']);
    exit;
}

// Input veilig uitlezen
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['message'])) {
    echo json_encode(['response' => 'Geen bericht ontvangen']);
    exit;
}

$userMessage = trim($data['message']);

// Voorbeeld antwoord
$userMessageLower = strtolower($userMessage);
if (strpos($userMessageLower, 'hallo') !== false) {
    $reply = "Hallo! Hoe kan ik je helpen?";
} else {
    $reply = "Ik heb je bericht ontvangen: \"$userMessage\".";
}

// JSON terugsturen
echo json_encode(['response' => $reply]);
