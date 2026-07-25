<?php

class StatusController
{
    public function status()
    {
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            "success" => true,
            "message" => "",
            "data" => [
                "system" => "AviCount",
                "status" => "online"
            ]
        ]);

        exit;
    }
}