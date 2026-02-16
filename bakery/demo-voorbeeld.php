<?php
// Chatbot API endpoint
// Dit is een voorbeeld PHP bestand om chatbot verzoeken af te handelen

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Behandel preflight OPTIONS verzoek
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Alleen POST verzoeken toestaan
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Methode niet toegestaan']);
    exit();
}

// Haal JSON input op
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['message']) || empty(trim($input['message']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Bericht is verplicht']);
    exit();
}

$userMessage = trim($input['message']);



// Voorbeeld: Eenvoudig echo antwoord (vervang met je echte logica)
$response = processMessage($userMessage);

echo json_encode([
    'response' => $response,
    'timestamp' => date('Y-m-d H:i:s')
]);

function processMessage($message) {
    // voorbeeld antwoorden (moet vervangen worden met echte chatbot )
    $messageLower = strtolower($message);
    
    if (strpos($messageLower, 'hallo') !== false || strpos($messageLower, 'hoi') !== false || strpos($messageLower, 'hey') !== false) {
        return "Hallo! Hoe kan ik je vandaag helpen?";
    }
    
    if (strpos($messageLower, 'help') !== false || strpos($messageLower, 'hulp') !== false) {
        return "Ik ben hier om te helpen! Wat wil je graag weten?";
    }
    
    if (strpos($messageLower, 'doei') !== false || strpos($messageLower, 'dag') !== false || strpos($messageLower, 'tot ziens') !== false) {
        return "Tot ziens! Fijne dag verder!";
    }
    
    // Standaard antwoord
    return "Ik heb je bericht ontvangen: \"" . htmlspecialchars($message) . "\". Dit is een voorbeeld antwoord.";
    
  
}
?>

