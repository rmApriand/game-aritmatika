<?php
session_start();
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $score = isset($input['score']) ? (int)$input['score'] : 0;
    $userId = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;

    if ($userId !== null) {
        // Ambil skor_penjumlahan yang ada
        $sqlSelect = "SELECT skor_penjumlahan FROM tbl_skor WHERE id_user = ?";
        $stmtSelect = $conn->prepare($sqlSelect);
        $stmtSelect->bind_param("i", $userId);
        $stmtSelect->execute();
        $stmtSelect->bind_result($existingScore);
        $stmtSelect->fetch();
        $stmtSelect->close();

        // Periksa apakah skor baru lebih besar dari skor yang ada
        if ($score > $existingScore) {

            if ($score > 100) {
                $score = 100;
            }
            
            // Update skor_penjumlahan dengan skor baru
            $sqlUpdate = "UPDATE tbl_skor SET skor_penjumlahan = ? WHERE id_user = ?";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bind_param("ii", $score, $userId);

            if ($stmtUpdate->execute()) {
                echo json_encode(["status" => "success", "message" => "Skor berhasil disimpan."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menyimpan skor."]);
            }

            $stmtUpdate->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Skor baru tidak lebih besar dari skor yang sudah ada."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Pengguna tidak ditemukan."]);
    }

    $conn->close();
}
?>
