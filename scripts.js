const API_URL = "https://6be4fa5c-e767-4bc7-a33b-c270ddafb704-00-3kvcl176eb195.worf.replit.dev/";

// Configuración para paginación
const PAGE_SIZE_LIST = 10; // Registros por página en la lista de carreras
const PAGE_SIZE_TABLE = 20; // Registros por página en la tabla de alumnos
let currentListPage = 1;
let currentTablePage = 1;

// Listar número de alumnos por carrera con paginación
function listarCarreras(page = 1) {
    fetch(`${API_URL}?endpoint=carreras&page=${page}&limit=${PAGE_SIZE_LIST}`)
        .then(response => response.json())
        .then(data => {
            const carrerasList = document.getElementById("carrerasList");
            const carreraSelect = document.getElementById("carreraSelect");
            const paginationControls = document.getElementById("paginationControls");

            // Actualizar la lista
            carrerasList.innerHTML = data.items.map(carrera =>
                `<li>${carrera.nomCP}: ${carrera.numero_alumnos} alumnos</li>`
            ).join("");

            // Actualizar el select (solo al cargar la primera página)
            if (page === 1) {
                carreraSelect.innerHTML += data.items.map(carrera =>
                    `<option value="${carrera.nomCP}">${carrera.nomCP}</option>`
                ).join("");
            }

            // Actualizar la paginación
            renderPagination(paginationControls, data.totalPages, page, listarCarreras);
        })
        .catch(error => console.error("Error al listar carreras:", error));
}

// Filtrar alumnos por carrera seleccionada con paginación
function filtrarAlumnos(carrera, page = 1) {
    fetch(`${API_URL}?endpoint=alumnos&carrera=${encodeURIComponent(carrera)}&page=${page}&limit=${PAGE_SIZE_TABLE}`)
        .then(response => response.json())
        .then(data => {
            const alumnosTable = document.getElementById("alumnosTable");
            const tablePagination = document.getElementById("tablePagination");

            // Actualizar la tabla
            alumnosTable.innerHTML = data.items.map(alumno =>
                `<tr>
                    <td>${alumno.Código_alumno}</td>
                    <td>${alumno.AP}</td>
                    <td>${alumno.Nom}</td>
                    <td>${alumno.edad}</td>
                    <td>${alumno.color}</td>
                </tr>`
            ).join("");

            // Actualizar la paginación
            renderPagination(tablePagination, data.totalPages, page, (newPage) => filtrarAlumnos(carrera, newPage));
        })
        .catch(error => console.error("Error al filtrar alumnos:", error));
}

// Renderizar controles de paginación
function renderPagination(container, totalPages, currentPage, onPageChange) {
    container.innerHTML = "";

    // Botón "Anterior"
    const prevButton = document.createElement("button");
    prevButton.textContent = "Anterior";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => onPageChange(currentPage - 1));
    container.appendChild(prevButton);

    // Botón "Siguiente"
    const nextButton = document.createElement("button");
    nextButton.textContent = "Siguiente";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => onPageChange(currentPage + 1));
    container.appendChild(nextButton);
}

// Manejar el cambio de carrera
document.getElementById("carreraSelect").addEventListener("change", (e) => {
    const carrera = e.target.value;
    if (carrera) {
        currentTablePage = 1; // Reiniciar la página de la tabla
        filtrarAlumnos(carrera, currentTablePage);
    }
});

// Inicializar lista de carreras
listarCarreras(currentListPage);
