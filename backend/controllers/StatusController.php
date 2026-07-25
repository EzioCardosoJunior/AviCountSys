<?php

class StatusController
{
    public function status()
    {
        echo json_encode([
            'success' => true,
            'message' => '',
            'data' => [
                'system' => 'AviCount',
                'status' => 'online',
                'version' => '0.1.0'
            ]
        ]);

        exit;
    }
}