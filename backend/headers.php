<?php

header("X-Teste: Funcionou");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

echo json_encode([
    "ok" => true
]);