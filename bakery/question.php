<?php

require_once "connection.php"; 
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>question form</title>
</head>
<body>


  <main>
  <section class="contain">
  <table>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Gender</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      <?php
      require_once "connection.php";

      $sql = "SELECT id, username, email, gender FROM MarzzUsers ORDER BY id";
      $result = $conn->query($sql);

      if ($result && $result->num_rows > 0) {
          $rows = $result->fetch_all(MYSQLI_ASSOC);
          foreach ($rows as $row) {
              echo "<tr>";
              echo "<th scope='row'>" . htmlspecialchars($row['id']) . "</th>";
              echo "<td>" . htmlspecialchars($row['username']) . "</td>";
              echo "<td>" . htmlspecialchars($row['email']) . "</td>";
              echo "<td>" . htmlspecialchars($row['gender']) . "</td>";
              echo "<td>";
              echo "<form action='editP.php' method='POST' style='display:inline;'>";
              echo "<input type='hidden' name='edit_id' value='" . htmlspecialchars($row['id']) . "'>";
              echo "<button type='submit' onclick=\"return confirm('Are you sure you want to edit this user?');\">edit</button>";
              echo "</form>";
              echo "</td>";
              echo "<td>";
              echo "<form action='editor.php' method='POST' style='display:inline;'>";
              echo "<input type='hidden' name='delete_id' value='" . htmlspecialchars($row['id']) . "'>";
              echo "<button type='submit' onclick=\"return confirm('Are you sure you want to delete this user?');\">Delete</button>";
              echo "</form>";
              echo "</td>";
              echo "</tr>";
          }
      } else {
          echo "<tr><td colspan='5'>No results found</td></tr>";
      }
      ?>
    </tbody>
  </table>

<form action="editor.php" method="POST">
  <button type="submit" name="logout">Logout</button>
</form>


</section>
</main>

  <footer>
    <section>
      <div>
        <p class="fth">Service & contact</p>
      </div>
      <div>
        Contact us at +3106-2711-1950
      </div>
    </section>
  </footer>
</body>
</html>
