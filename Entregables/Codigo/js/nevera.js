// Responsable: Alejandro

document.addEventListener('DOMContentLoaded', function () {
    const btnToggleConsejo = document.getElementById("btn-toggle-consejo");
    const cajaConsejos = document.getElementById("caja-consejos");
    const btnModoAlerta = document.getElementById("btn-modo-alerta");
    const btnReordenar = document.getElementById("btn-reordenar");
    const btnAnadir = document.getElementById("btn-anadir");
    const cuerpoTabla = document.getElementById("cuerpo-tabla-alimentos");
    const contadorTotal = document.getElementById("total-alimentos");
    const contadorUrgentes = document.getElementById("total-urgentes");

    let modoAlertaActivo = false;

    // Mostrar u ocultar la caja de consejos
    btnToggleConsejo.addEventListener("click", function () {
        if (cajaConsejos.style.display === "none" || cajaConsejos.style.display === "") {
            cajaConsejos.style.display = "block";
            btnToggleConsejo.textContent = "Ocultar Consejos de Conservación";
        } else {
            cajaConsejos.style.display = "none";
            btnToggleConsejo.textContent = "Mostrar Consejos de Conservación";
        }
    });

    // Activar o desactivar colores de alerta de caducidad
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

    // Mover alimentos urgentes arriba en la tabla
    btnReordenar.addEventListener("click", function () {
        const filas = Array.from(cuerpoTabla.getElementsByTagName("tr"));

        for (let i = filas.length - 1; i >= 0; i--) {
            const fila = filas[i];
            const estado = fila.getAttribute("data-estado");

            if (estado === "urgente" || estado === "muy-urgente") {
                const primerElemento = cuerpoTabla.firstChild;
                cuerpoTabla.insertBefore(fila, primerElemento);
            }
        }

        alert("Se ha cambiado la estructura de la tabla: Alimentos urgentes colocados arriba");
    });

    // Añadir nuevo alimento desde el formulario
    btnAnadir.addEventListener("click", function () {
        const nombreInput = document.getElementById("input-alimento");
        const categoriaInput = document.getElementById("select-categoria");
        const fechaInput = document.getElementById("input-fecha");
        const cantidadInput = document.getElementById("input-cantidad");

        const nombre = nombreInput.value.trim();
        const categoria = categoriaInput.value;
        const fecha = fechaInput.value;
        const cantidad = cantidadInput.value;

        if (nombre === "" || fecha === "") {
            alert("Por favor, introduce el nombre del alimento y su fecha de caducidad.");
            return;
        }

        const fechaCad = new Date(fecha);
        const hoy = new Date();
        const diferenciaDias = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));

        let estadoTexto = "Optimo";
        let estadoClase = "estado-optimo";
        let dataEstado = "optimo";

        if (diferenciaDias <= 1) {
            estadoTexto = "Consumir ya";
            estadoClase = "estado-caducando";
            dataEstado = "muy-urgente";
        } else if (diferenciaDias <= 3) {
            estadoTexto = "Proximo a vencer";
            estadoClase = "estado-pronto";
            dataEstado = "urgente";
        }

        const nuevaFila = document.createElement("tr");
        nuevaFila.setAttribute("data-estado", dataEstado);
        nuevaFila.innerHTML = `
            <td><strong>${nombre}</strong> (${cantidad})</td>
            <td>${categoria}</td>
            <td>${fecha}</td>
            <td><span class="etiqueta-estado ${estadoClase}">${estadoTexto}</span></td>
            <td><button type="button" class="btn-peligro btn-eliminar">Eliminar</button></td>
        `;

        const btnEliminar = nuevaFila.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", function () {
            cuerpoTabla.removeChild(nuevaFila);
            actualizarContadores();
        });

        cuerpoTabla.appendChild(nuevaFila);

        nombreInput.value = "";
        fechaInput.value = "";
        cantidadInput.value = "1";

        actualizarContadores();
    });

    // Botones de eliminar existentes
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

    actualizarContadores();
});
