<?php
require "connection.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get the data from the form (we protect against basic attacks)
    $question_id = intval($_POST['question_id']);                // the hidden ID of the question
    $answer      = $conn->real_escape_string($_POST['answer']);  // the answer text

    // SQL query that sends the answer (named $answer) to data base and updates the answered question boalean to 1/true
    // Also connnects the answer to the question id

    $sql = "UPDATE ANT 
            SET chatlog = '$answer', 
                answered = 1 
            WHERE id = $question_id";

    if ($conn->query($sql) === TRUE) {
        // If Successful it will return you back to admin page with a nice message
        header("Location: admin.php?success=Answer+saved+successfully!");
        exit();
    } else {
        // If something went wrong it will return you back to admin page with a error message
        header("Location: admin.php?error=Something+went+wrong");
        exit();
    }
}

$conn->close();
?>