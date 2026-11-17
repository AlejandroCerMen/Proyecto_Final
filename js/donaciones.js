/* ==========================================================================
   FICHERO: js/donaciones.js
   RESPONSABLE: Miembro 4 del Equipo
   DESCRIPCIÓN: Validación del formulario de donaciones y filtrado de la
                tabla de comedores sociales para la página donaciones.html.
   REQUISITOS CUBIERTOS:
     - Validación y captura de datos de formulario
     - Modificación dinámica de estilos y contenido (mensajes de éxito)
     - Filtrado interactivo de filas de una tabla HTML
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Módulo de Donaciones y Red Solidaria cargado correctamente.");

    // Elementos del formulario
    const formDonacion = document.getElementById("form-donacion");
    const inputNombre = document.getElementById("donante-nombre");
    const inputEmail = document.getElementById("donante-email");
    const selectAlimento = document.getElementById("donante-alimento");
    const selectCentro = document.getElementById("donante-centro");
    const inputCantidad = document.getElementById("donante-cantidad");
    const checkCondiciones = document.getElementById("donante-condiciones");
    const mensajeExito = document.getElementById("mensaje-exito-donacion");
    const textoDetalleDonacion = document.getElementById("detalle-donacion");

    // Elementos de la tabla y su filtro
    const filtroZona = document.getElementById("filtro-zona-comedor");
    const filasComedores = document.querySelectorAll("#tabla-comedores tbody tr");

    /* ----------------------------------------------------------------------
       1. ENVÍO Y VALIDACIÓN DEL FORMULARIO DE DONACIÓN
       ---------------------------------------------------------------------- */
    formDonacion.addEventListener("submit", function (evento) {
        // Evitamos la recarga tradicional de la página
        evento.preventDefault();

        const nombre = inputNombre.value.trim();
        const email = inputEmail.value.trim();
        const alimento = selectAlimento.value;
        const centro = selectCentro.options[selectCentro.selectedIndex].text;
        const cantidad = inputCantidad.value;

        if (nombre === "" || email === "") {
            alert("Por favor, rellena tu nombre y correo electrónico.");
            return;
        }

        if (!checkCondiciones.checked) {
            alert("Debes confirmar que los alimentos están en perfecto estado de conservación.");
            return;
        }

        // Mostrar mensaje de confirmación dinámico
        textoDetalleDonacion.textContent = `¡Muchas gracias, ${nombre}! Hemos registrado tu donación de ${cantidad} kg de "${alimento}" para el centro "${centro}". Te hemos enviado los detalles de recogida a ${email}.`;
        mensajeExito.style.display = "block";

        // Desplazar suavemente hasta el mensaje
        mensajeExito.scrollIntoView({ behavior: "smooth" });

        // Limpiar el formulario
        formDonacion.reset();
    });

    /* ----------------------------------------------------------------------
       2. FILTRADO INTERACTIVO DE LA TABLA DE COMEDORES (por Zona/Distrito)
       ---------------------------------------------------------------------- */
    filtroZona.addEventListener("change", function () {
        const zonaSeleccionada = filtroZona.value.toLowerCase();

        filasComedores.forEach(function (fila) {
            const zonaFila = fila.getAttribute("data-zona").toLowerCase();

            if (zonaSeleccionada === "todas" || zonaFila === zonaSeleccionada) {
                fila.style.display = ""; // Mostrar
            } else {
                fila.style.display = "none"; // Ocultar
            }
        });
    });
});
