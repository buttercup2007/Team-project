<?php

// Database connection 
$servername = "localhost";
$username   = "root";       
$password   = "password";   
$dbname     = "chatB";      

$conn = new mysqli($servername, $username, $password, $dbname);

// if something is wrong it will stop and show an error.
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>