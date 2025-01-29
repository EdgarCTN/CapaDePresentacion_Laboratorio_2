const API_URL = "https://6be4fa5c-e767-4bc7-a33b-c270ddafb704-00-3kvcl176eb195.worf.replit.dev/";
const PAGE_SIZE = 10; // Registros por página

let allCarreras = []; // Guardar todas las carreras para búsqueda

// Listar carreras con paginación
function listarCarreras(page = 1) {
    fetch(`${API_URL}?endpoint=carreras`)
        .then(response => response.json())
        .then(data => {
            allCarreras = data; // Guardar todas las carreras para filtrar
            const filteredCarreras = filtrarCarreras();
            renderCarreras(filteredCarreras, page);
            createPagination(filteredCarreras.length, page, listarCarreras, "carrerasPagination");
        })
        .catch(error => console.error("Error al listar carreras:", error));
}

// Renderizar carreras de la página actual
function renderCarreras(data, page) {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const carrerasList = document.getElementById("carrerasList");

    const pageData = data.slice(start, end);
    carrerasList.innerHTML = pageData.map(carrera =>
        `<li>${carrera.nomCP}: ${carrera.numero_alumnos} alumnos</li>`
    ).join("");
}

// Filtrar carreras basado en la búsqueda
function filtrarCarreras() {
    const query = document.getElementById("searchCarrera").value.toLowerCase();
    return allCarreras.filter(carrera => carrera.nomCP.toLowerCase().includes(query));
}

// Filtrar alumnos con paginación
function filtrarAlumnos(carrera, page = 1) {
    fetch(`${API_URL}?endpoint=alumnos&carrera=${encodeURIComponent(carrera)}`)
        .then(response => response.json())
        .then(data => {
            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const alumnosTable = document.getElementById("alumnosTable");

            const pageData = data.slice(start, end);
            alumnosTable.innerHTML = pageData.map(alumno =>
                `<tr>
                    <td>${alumno.Código_alumno}</td>
                    <td>${alumno.AP}</td>
                    <td>${alumno.Nom}</td>
                    <td>${alumno.edad}</td>
                    <td>${alumno.color}</td>
                </tr>`
            ).join("");

            createPagination(data.length, page, (newPage) => filtrarAlumnos(carrera, newPage), "alumnosPagination");
        })
        .catch(error => console.error("Error al filtrar alumnos:", error));
}

// Crear paginación
function createPagination(totalItems, currentPage, callback, containerId) {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === currentPage ? "active" : "";
        button.addEventListener("click", () => callback(i));
        container.appendChild(button);
    }
}

// Evento de búsqueda de carreras
document.getElementById("searchCarrera").addEventListener("input", () => {
    renderCarreras(filtrarCarreras(), 1);
    createPagination(filtrarCarreras().length, 1, listarCarreras, "carrerasPagination");
});

// Inicializar
listarCarreras();
