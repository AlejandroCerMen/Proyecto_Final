/* ==========================================================================
   FICHERO: js/nevera.js
   RESPONSABLE: Miembro 1 del Equipo
   DESCRIPCIÓN: Gestión del inventario de alimentos, alertas de caducidad y
                manipulación del DOM para la página principal (index.html).
   REQUISITOS CUBIERTOS:
     - Aparición y desaparición de elementos (Consejos)
     - Cambio de estilo de elementos (Modo alerta de caducidad)
     - Cambio en la estructura de la página (Reordenar filas con insertBefore)
     - Inserción y eliminación de elementos en el DOM (createElement, removeChild)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Módulo de la Nevera cargado correctamente.");

    // Referencias a elementos del DOM
    const btnToggleConsejo = document.getElementById("btn-toggle-consejo");
    const cajaConsejos = document.getElementById("caja-consejos");
    const btnModoAlerta = document.getElementById("btn-modo-alerta");
    const btnReordenar = document.getElementById("btn-reordenar");
    const btnAnadir = document.getElementById("btn-anadir");
    const cuerpoTabla = document.getElementById("cuerpo-tabla-alimentos");
    const contadorTotal = document.getElementById("total-alimentos");
    const contadorUrgentes = document.getElementById("total-urgentes");

    // Variable de estado para el modo alerta
    let modoAlertaActivo = false;

    /* ----------------------------------------------------------------------
       REQUISITO A: APARICIÓN Y DESAPARICIÓN DE ELEMENTOS
       Muestra u oculta la caja de consejos al hacer clic
       ---------------------------------------------------------------------- */
    btnToggleConsejo.addEventListener("click", function () {
        if (cajaConsejos.style.display === "none" || cajaConsejos.style.display === "") {
            cajaConsejos.style.display = "block";
            btnToggleConsejo.textContent = "Ocultar Consejos de Conservación";
        } else {
            cajaConsejos.style.display = "none";
            btnToggleConsejo.textContent = "Mostrar Consejos de Conservación";
        }
    });

    /* ----------------------------------------------------------------------
       REQUISITO B: CAMBIOS DE ESTILO EN ELEMENTOS
       Activa o desactiva estilos destacados para alimentos que caducan pronto
       ---------------------------------------------------------------------- */
    btnModoAlerta.addEventListener("click", function () {
        modoAlertaActivo = !modoAlertaActivo;

        const filas = cuerpoTabla.getElementsByTagName("tr");

        for (let i = 0; i < filas.length; i++) {
            const fila = filas[i];
            const estado = fila.getAttribute("data-estado");

            if (modoAlertaActivo) {
                if (estado === "urgente") {
                    fila.style.backgroundColor = "#fff3cd";
                    fila.style.fontWeight = "bold";
                    fila.style.borderLeft = "5px solid #ff9800";
                } else if (estado === "muy-urgente") {
                    fila.style.backgroundColor = "#fee2e2";
                    fila.style.fontWeight = "bold";
                    fila.style.borderLeft = "5px solid #dc2626";
                } else {
                    fila.style.opacity = "0.6";
                }
            } else {
                // Restaurar estilos por defecto
                fila.style.backgroundColor = "";
                fila.style.fontWeight = "normal";
                fila.style.borderLeft = "";
                fila.style.opacity = "1";
            }
        }

        if (modoAlertaActivo) {
            btnModoAlerta.textContent = "Desactivar Modo Alerta";
            btnModoAlerta.style.backgroundColor = "#b91c1c";
        } else {
            btnModoAlerta.textContent = "Activar Modo Alerta de Caducidad";
            btnModoAlerta.style.backgroundColor = "#0284c7";
        }
    });

    /* ----------------------------------------------------------------------
       REQUISITO C: CAMBIO DE LA ESTRUCTURA DE LA PÁGINA (POSICIÓN EN EL DOM)
       Reordena la tabla moviendo los alimentos urgentes al inicio con insertBefore
       ---------------------------------------------------------------------- */
    btnReordenar.addEventListener("click", function () {
        const filas = Array.from(cuerpoTabla.getElementsByTagName("tr"));

        // Buscamos las filas urgentes y las movemos una a una antes del primer hijo
        for (let i = filas.length - 1; i >= 0; i--) {
            const fila = filas[i];
            const estado = fila.getAttribute("data-estado");

            if (estado === "urgente" || estado === "muy-urgente") {
                const primerElemento = cuerpoTabla.firstChild;
                cuerpoTabla.insertBefore(fila, primerElemento);
            }
        }

        alert("Se ha cambiado la estructura de la tabla: ¡Alimentos urgentes colocados arriba!");
    });

    /* ----------------------------------------------------------------------
       AÑADIR ELEMENTOS AL INVENTARIO (CREACIÓN DINÁMICA DE NODOS)
       ---------------------------------------------------------------------- */
    btnAnadir.addEventListener("click", function () {
        const nombreInput = document.getElementById("input-alimento");
        const categoriaInput = document.getElementById("select-categoria");
        const fechaInput = document.getElementById("input-fecha");
        const cantidadInput = document.getElementById("input-cantidad");

        const nombre = nombreInput.value.trim();
        const categoria = categoriaInput.value;
        const fecha = fechaInput.value;
        const cantidad = cantidadInput.value;

        // Validación simple
        if (nombre === "" || fecha === "") {
            alert("Por favor, introduce el nombre del alimento y su fecha de caducidad.");
            return;
        }

        // Determinar estado de caducidad comparando con la fecha actual
        const fechaCad = new Date(fecha);
        const hoy = new Date();
        const diferenciaDias = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));

        let estadoTexto = "Óptimo";
        let estadoClase = "estado-optimo";
        let dataEstado = "optimo";

        if (diferenciaDias <= 1) {
            estadoTexto = "¡Consumir ya!";
            estadoClase = "estado-caducando";
            dataEstado = "muy-urgente";
        } else if (diferenciaDias <= 3) {
            estadoTexto = "Próximo a vencer";
            estadoClase = "estado-pronto";
            dataEstado = "urgente";
        }

        // Crear nueva fila tr
        const nuevaFila = document.createElement("tr");
        nuevaFila.setAttribute("data-estado", dataEstado);

        // Crear contenido de la fila
        nuevaFila.innerHTML = `
            <td><strong>${nombre}</strong> (${cantidad})</td>
            <td>${categoria}</td>
            <td>${fecha}</td>
            <td><span class="etiqueta-estado ${estadoClase}">${estadoTexto}</span></td>
            <td><button type="button" class="btn-peligro btn-eliminar">Eliminar</button></td>
        `;

        // Añadir evento al botón de eliminar recién creado
        const btnEliminar = nuevaFila.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", function () {
            cuerpoTabla.removeChild(nuevaFila);
            actualizarContadores();
        });

        // Insertar en la tabla con appendChild
        cuerpoTabla.appendChild(nuevaFila);

        // Limpiar campos del formulario
        nombreInput.value = "";
        fechaInput.value = "";
        cantidadInput.value = "1";

        actualizarContadores();
    });

    /* ----------------------------------------------------------------------
       ELIMINACIÓN DE FILAS INICIALES EXISTENTES
       ---------------------------------------------------------------------- */
    const botonesEliminarIniciales = document.querySelectorAll(".btn-eliminar");
    botonesEliminarIniciales.forEach(function (boton) {
        boton.addEventListener("click", function () {
            const fila = boton.closest("tr");
            if (fila) {
                cuerpoTabla.removeChild(fila);
                actualizarContadores();
            }
        });
    });

    /* ----------------------------------------------------------------------
       FUNCIÓN AUXILIAR: ACTUALIZAR CONTADORES
       ---------------------------------------------------------------------- */
    function actualizarContadores() {
        const filas = cuerpoTabla.getElementsByTagName("tr");
        let urgentes = 0;

        for (let i = 0; i < filas.length; i++) {
            const estado = filas[i].getAttribute("data-estado");
            if (estado === "urgente" || estado === "muy-urgente") {
                urgentes++;
            }
        }

        contadorTotal.textContent = filas.length;
        contadorUrgentes.textContent = urgentes;
    }

    // Calcular contadores al iniciar la página
    actualizarContadores();
});
