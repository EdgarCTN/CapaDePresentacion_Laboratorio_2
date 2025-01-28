<?php
require_once "./logica_negocio/alumnosLogica.php";
require_once "./logica_negocio/carrerasLogica.php";

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['carrera'])) {
        echo json_encode(obtenerAlumnosPorCarrera($_GET['carrera']));
    } else {
        echo json_encode(obtenerCarrerasConAlumnos());
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
