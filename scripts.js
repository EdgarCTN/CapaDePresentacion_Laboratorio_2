const API_URL = "https://6be4fa5c-e767-4bc7-a33b-c270ddafb704-00-3kvcl176eb195.worf.replit.dev/";
const PAGE_SIZE = 10; // Registros por página

// Indicador de carga
const loadingIndicator = document.getElementById("loadingIndicator");

function toggleLoading(show) {
    loadingIndicator.style.display = show ? "block" : "none";
}

// Listar carreras con búsqueda y paginación
function listarCarreras(page = 1) {
    toggleLoading(true);

    fetch(`${API_URL}?endpoint=carreras`)
        .then((response) => response.json())
        .then((data) => {
            const searchInput = document.getElementById("searchCarreras").value.toLowerCase();
            const filteredData = data.filter((carrera) =>
                carrera.nomCP.toLowerCase().includes(searchInput)
            );

            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const carrerasList = document.getElementById("carrerasList");
            const carreraSelect = document.getElementById("carreraSelect");

            // Mostrar solo las carreras de la página actual
            const pageData = filteredData.slice(start, end);
            carrerasList.innerHTML = pageData
                .map(
                    (carrera) =>
                        `<li>${carrera.nomCP}: ${carrera.numero_alumnos} alumnos</li>`
                )
                .join("");

            // Llenar el select (solo la primera vez)
            if (carreraSelect.options.length === 1) {
                carreraSelect.innerHTML += data
                    .map(
                        (carrera) =>
                            `<option value="${carrera.nomCP}">${carrera.nomCP}</option>`
                    )
                    .join("");
            }

            // Crear paginación
            createPagination(
                filteredData.length,
                page,
                listarCarreras,
                "carrerasPagination"
            );
        })
        .catch((error) => console.error("Error al listar carreras:", error))
        .finally(() => toggleLoading(false));
}

// Listar alumnos con paginación
function filtrarAlumnos(carrera, page = 1) {
    toggleLoading(true);

    fetch(`${API_URL}?endpoint=alumnos&carrera=${encodeURIComponent(carrera)}`)
        .then((response) => response.json())
        .then((data) => {
            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const alumnosTable = document.getElementById("alumnosTable");

            // Mostrar solo los alumnos de la página actual
            const pageData = data.slice(start, end);
            alumnosTable.innerHTML = pageData
                .map(
                    (alumno) => `
                <tr>
                    <td>${alumno.Código_alumno}</td>
                    <td>${alumno.AP}</td>
                    <td>${alumno.Nom}</td>
                    <td>${alumno.edad}</td>
                    <td>${alumno.color}</td>
                </tr>`
                )
                .join("");

            // Crear paginación
            createPagination(
                data.length,
                page,
                (newPage) => filtrarAlumnos(carrera, newPage),
                "alumnosPagination"
            );
        })
        .catch((error) => console.error("Error al filtrar alumnos:", error))
        .finally(() => toggleLoading(false));
}

// Crear paginación
function createPagination(totalItems, currentPage, callback, containerId) {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <button ${currentPage === 1 ? "disabled" : ""}>&laquo;</button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1)
            .map(
                (page) =>
                    `<button ${
                        page === currentPage ? "class='active'" : ""
                    }>${page}</button>`
            )
            .join("")}
        <button ${currentPage === totalPages ? "disabled" : ""}>&raquo;</button>
    `;

    container.querySelectorAll("button").forEach((button, index) => {
        const page = index === 0 ? currentPage - 1 : index === totalPages + 1 ? currentPage + 1 : index;
        if (page >= 1 && page <= totalPages) {
            button.addEventListener("click", () => callback(page));
        }
    });
}

// Eventos iniciales
document.getElementById("carreraSelect").addEventListener("change", (e) => {
    if (e.target.value) filtrarAlumnos(e.target.value);
});

document.getElementById("searchCarreras").addEventListener("input", () => {
    listarCarreras();
});

listarCarreras();
