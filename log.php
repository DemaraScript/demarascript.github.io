<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $action = $_POST['action'] ?? 'COPIED';
    $timestamp = $_POST['timestamp'] ?? date('Y-m-d H:i:s');
    
    if (!empty($email)) {
        $logEntry = date('Y-m-d H:i:s') . " - $action - $email\n";
        file_put_contents('email_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
        
        echo json_encode(['success' => true, 'message' => 'Logged successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No email provided']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
