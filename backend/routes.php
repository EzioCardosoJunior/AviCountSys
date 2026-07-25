<?php

require_once __DIR__ . '/controllers/StatusController.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($action) {

    case 'status':

        $controller = new StatusController();
        $controller->status();

        break;

    default:

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Endpoint não encontrado.',
            'data' => null
        ]);

        break;
}