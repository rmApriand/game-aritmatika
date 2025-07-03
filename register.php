<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $conn->begin_transaction();
    
    try {
        $sql_user = "INSERT INTO user (nama_user, keaktifan) VALUES (?, 0)";
        $stmt_user = $conn->prepare($sql_user);
        $stmt_user->bind_param("s", $username);
        
        if ($stmt_user->execute()) {
            $id_user = $conn->insert_id;

            $sql_skor = "INSERT INTO tbl_skor (id_user, skor_penjumlahan, skor_pengurangan) VALUES (?, 0, 0)";
            $stmt_skor = $conn->prepare($sql_skor);
            $stmt_skor->bind_param("i", $id_user);
            
            if ($stmt_skor->execute()) {
                $conn->commit();
                echo "Registration successful. Please <a href='index.html'>login</a>.";
            } else {
                $conn->rollback();
                echo "Error: " . $sql_skor . "<br>" . $conn->error;
            }
            $stmt_skor->close();
        } else {
            $conn->rollback();
            echo "Error: " . $sql_user . "<br>" . $conn->error;
        }
        $stmt_user->close();
    } catch (Exception $e) {
        $conn->rollback();
        echo "Error: " . $e->getMessage();
    }
    
    $conn->close();
}
?>
