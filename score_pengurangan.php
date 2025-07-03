<?php
session_start();
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $scorePengurangan = isset($input['score']) ? (int)$input['score'] : 0;
    $userId = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;

    if ($userId !== null) {
        // Ambil skor_pengurangan yang ada
        $sqlSelect = "SELECT skor_pengurangan FROM tbl_skor WHERE id_user = ?";
        $stmtSelect = $conn->prepare($sqlSelect);
        $stmtSelect->bind_param("i", $userId);
        $stmtSelect->execute();
        $stmtSelect->bind_result($existingScorePengurangan);
        $stmtSelect->fetch();
        $stmtSelect->close();

        // Tambahkan skorPengurangan ke skor_pengurangan yang ada
        $newScorePengurangan = $existingScorePengurangan + $scorePengurangan;

        if ($newScorePengurangan > 100) {
            $newScorePengurangan = 100;
        }
        
        // Update skor_pengurangan dengan skor baru
        $sqlUpdate = "UPDATE tbl_skor SET skor_pengurangan = ? WHERE id_user = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param("ii", $newScorePengurangan, $userId);

        if ($stmtUpdate->execute()) {
            echo json_encode(["status" => "success", "message" => "Skor berhasil disimpan."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan skor."]);
        }

        $stmtUpdate->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Pengguna tidak ditemukan."]);
    }

    $conn->close();
}
?>
