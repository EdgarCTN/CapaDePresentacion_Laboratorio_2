<?php
require_once "../acceso_datos/AlumnoRepositorio.php";

function obtenerAlumnosPorCarrera($carrera) {
    $alumnoRepo = new AlumnoRepositorio();
    $alumnos = $alumnoRepo->filtrarAlumnosPorCarrera($carrera);

    // Lógica adicional, por ejemplo, transformación de datos
    foreach ($alumnos as &$alumno) {
        $alumno['nombre_completo'] = $alumno['AP'] . ' ' . $alumno['Nom'];
    }

    return $alumnos;
}
?>
