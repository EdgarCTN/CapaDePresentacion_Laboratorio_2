document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "../servicios/";

    // Listar número de alumnos por carrera
    function listarCarreras() {
        fetch(`${API_URL}carreras.php`)
            .then(response => response.json())
            .then(data => {
                const carrerasList = document.getElementById("carrerasList");
                const carreraSelect = document.getElementById("carreraSelect");

                carrerasList.innerHTML = data.map(carrera => 
                    `<li>${carrera.nomCP}: ${carrera.numero_alumnos} alumnos</li>`
                ).join("");

                carreraSelect.innerHTML += data.map(carrera => 
                    `<option value="${carrera.nomCP}">${carrera.nomCP}</option>`
                ).join("");
            })
            .catch(error => console.error("Error al listar carreras:", error));
    }

    // Filtrar alumnos por carrera seleccionada
    function filtrarAlumnos(carrera) {
        fetch(`${API_URL}alumnos.php?carrera=${carrera}`)
            .then(response => response.json())
            .then(data => {
                const alumnosTable = document.getElementById("alumnosTable");
                alumnosTable.innerHTML = data.map(alumno => 
                    `<tr>
                        <td>${alumno.Código_alumno}</td>
                        <td>${alumno.AP}</td>
                        <td>${alumno.Nom}</td>
                        <td>${alumno.edad}</td>
                        <td>${alumno.color}</td>
                    </tr>`
                ).join("");
            })
            .catch(error => console.error("Error al filtrar alumnos:", error));
    }

    document.getElementById("carreraSelect").addEventListener("change", (e) => {
        if (e.target.value) filtrarAlumnos(e.target.value);
    });

    listarCarreras();
});
