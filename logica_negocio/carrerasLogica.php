<?php
require_once "../acceso_datos/CarreraRepositorio.php";

function obtenerCarrerasConAlumnos() {
    $carreraRepo = new CarreraRepositorio();
    $carreras = $carreraRepo->listarCarreras();

    // Formateo o lógica adicional antes de enviar los datos
    foreach ($carreras as &$carrera) {
        $carrera['numero_alumnos'] = (int)$carrera['numero_alumnos'];
    }

    return $carreras;
}
?>
