<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot Admin | Answer Questions</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="admin.css">           <!-- your existing admin styles -->
  <link rel="stylesheet" href="admin-answer.css">    <!-- new specific styles for this page -->
</head>
<body>

<div class="container">
  <div class="answer-card">

    <!-- Unanswered Questions List -->
    <div class="unanswered-box">
      <h2>Unanswered Questions</h2>
      <?php
      // Connect to your database - adjust credentials!
      $host = 'localhost';
      $dbname = 'chatB';
      $user = 'root';
      $pass = '';

      try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare("
          SELECT id, question, created_at 
          FROM ANT 
          WHERE is_answered = 0 
          ORDER BY created_at DESC
        ");
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($questions) === 0) {
          echo '<p style="color:#777;">No unanswered questions at the moment.</p>';
        } else {
          foreach ($questions as $q) {
            $time = date('d M Y H:i', strtotime($q['created_at']));
            echo '
            <div class="question-item" data-id="' . $q['id'] . '">
              <div class="question-info">
                <div class="q-id">#' . htmlspecialchars($q['id']) . '</div>
                <div>' . htmlspecialchars($q['question']) . '</div>
                <div class="q-time">' . $time . '</div>
              </div>
              <button class="select-btn" type="button">Answer this</button>
            </div>';
          }
        }
      } catch (PDOException $e) {
        echo '<p style="color:red;">Database error: ' . htmlspecialchars($e->getMessage()) . '</p>';
      }
      ?>
    </div>

    <!-- Answer Form -->
    <h1>Add New Answer</h1>
    <p class="subtitle">Select a question above and provide the answer below</p>

    <form action="insertFunc.php" method="POST" class="answer-form" id="answerForm">
      <input type="hidden" name="question_id" id="question_id" value="">

      <div class="input-group">
        <label for="answer">Antwoord toevoegen</label>
        <textarea name="answer" id="answer" rows="5" placeholder="Type the answer here..." required></textarea>
      </div>

      <button type="submit" class="submit-btn">
        <span>Add Answer</span>
      </button>
    </form>
  </div>
</div>

<script>
  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.question-item').forEach(item => item.classList.remove('selected'));
      this.closest('.question-item').classList.add('selected');
      const qid = this.closest('.question-item').dataset.id;
      document.getElementById('question_id').value = qid;
      document.getElementById('answerForm').scrollIntoView({ behavior: 'smooth' });
    });
  });
</script>

</body>
</html>