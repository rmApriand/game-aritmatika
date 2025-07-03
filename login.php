<?php
session_start();
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];

    $sql = "SELECT id_user, keaktifan FROM user WHERE nama_user = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id_user, $keaktifan);
        $stmt->fetch();
        $_SESSION['id_user'] = $id_user;
        $_SESSION['username'] = $username;

        // Tambahkan 5 pada keaktifan
        $keaktifan += 2;
        $_SESSION['keaktifan'] = $keaktifan;

        // Update keaktifan di database
        $update_sql = "UPDATE user SET keaktifan = ? WHERE id_user = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ii", $keaktifan, $id_user);
        $update_stmt->execute();
        $update_stmt->close();

        header("Location: Home.html");
    } else {
        echo "No user found with that username.";
    }

    $stmt->close();
    $conn->close();
}
?>
