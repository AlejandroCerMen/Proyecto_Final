// Responsable: Pablo

document.addEventListener("DOMContentLoaded", function () {
    const formDonacion = document.getElementById("form-donacion");
    const inputNombre = document.getElementById("donante-nombre");
    const inputEmail = document.getElementById("donante-email");
    const selectAlimento = document.getElementById("donante-alimento");
    const selectCentro = document.getElementById("donante-centro");
    const inputCantidad = document.getElementById("donante-cantidad");
    const checkCondiciones = document.getElementById("donante-condiciones");
    const mensajeExito = document.getElementById("mensaje-exito-donacion");
    const textoDetalleDonacion = document.getElementById("detalle-donacion");

    const filtroZona = document.getElementById("filtro-zona-comedor");
    const filasComedores = document.querySelectorAll("#tabla-comedores tbody tr");

    // Validar y enviar formulario de donacion
    formDonacion.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = inputNombre.value.trim();
        const email = inputEmail.value.trim();
        const alimento = selectAlimento.value;
        const centro = selectCentro.options[selectCentro.selectedIndex].text;
        const cantidad = inputCantidad.value;

        if (nombre === "" || email === "") {
            alert("Por favor, rellena tu nombre y correo electronico.");
            return;
        }

        if (!checkCondiciones.checked) {
            alert("Debes confirmar que los alimentos estan en buen estado.");
            return;
        }

        textoDetalleDonacion.textContent = `Muchas gracias, ${nombre}. Hemos registrado tu donacion de ${cantidad} kg de "${alimento}" para "${centro}". Te hemos enviado los detalles a ${email}.`;
        mensajeExito.style.display = "block";
        mensajeExito.scrollIntoView({ behavior: "smooth" });

        formDonacion.reset();
    });

    // Filtrar tabla por zona
    filtroZona.addEventListener("change", function () {
        const zonaSeleccionada = filtroZona.value.toLowerCase();

        filasComedores.forEach(function (fila) {
            const zonaFila = fila.getAttribute("data-zona").toLowerCase();

            if (zonaSeleccionada === "todas" || zonaFila === zonaSeleccionada) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        });
    });

    // Gestion de los puntos del mapa
    const mapaIframe = document.getElementById("mapa-valencia");
    const textoInfoMapa = document.getElementById("info-marcador-mapa");
    const botonesMapa = document.querySelectorAll(".btn-cambiar-mapa");

    botonesMapa.forEach(function (boton) {
        boton.addEventListener("click", function () {
            const id = boton.getAttribute("data-id");
            const nombre = boton.getAttribute("data-nombre");

            if (id && id !== "") {
                mapaIframe.src = "mapa-valencia.html?id=" + id;
                textoInfoMapa.textContent = "Punto enfocado actualmente: " + nombre + ".";
            } else {
                mapaIframe.src = "mapa-valencia.html";
                textoInfoMapa.textContent = "Visualizacion actual: Todos los puntos solidarios visibles en el mapa de Valencia.";
            }

            mapaIframe.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });
});
