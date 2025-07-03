<?php
include 'config.php';

$sql = "
    SELECT nama_user, keaktifan, 
    skor_penjumlahan, skor_pengurangan,
    ROUND((skor_penjumlahan + skor_pengurangan) / 2) AS skor_total
    FROM user 
    JOIN tbl_skor ON user.id_user = tbl_skor.id_user
    ORDER BY skor_total DESC 
    LIMIT 10
";

$result = $conn->query($sql);

$leaderboard = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
}
echo json_encode($leaderboard);

$conn->close();
?>
