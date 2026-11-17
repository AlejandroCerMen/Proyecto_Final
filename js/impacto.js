/* ==========================================================================
   FICHERO: js/impacto.js
   RESPONSABLE: Miembro 3 del Equipo
   DESCRIPCIÓN: Cálculo dinámico de huella ecológica, ahorro de CO2 y dinero
                con JavaScript interactivo para la página impacto.html.
   REQUISITOS CUBIERTOS:
     - Procesamiento de datos en cliente
     - Actualización dinámica del contenido del DOM (innerHTML, textContent)
     - Modificación de estilos y clases en función de los resultados
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Módulo de la Calculadora de Impacto cargado correctamente.");

    // Elementos de entrada del formulario
    const sliderKilos = document.getElementById("slider-kilos");
    const spanKilosValor = document.getElementById("valor-kilos-slider");
    const inputPersonas = document.getElementById("input-personas");
    const selectTipoAlimento = document.getElementById("select-tipo-alimento");
    const btnCalcular = document.getElementById("btn-calcular-impacto");

    // Elementos donde se muestran los resultados
    const resKilosAnio = document.getElementById("res-kilos-anio");
    const resCo2Anio = document.getElementById("res-co2-anio");
    const resEurosAnio = document.getElementById("res-euros-anio");
    const badgeNivel = document.getElementById("badge-nivel-sostenible");
    const mensajeNivel = document.getElementById("mensaje-nivel");

    // Evento para actualizar en tiempo real el valor visible del slider
    sliderKilos.addEventListener("input", function () {
        spanKilosValor.textContent = sliderKilos.value + " kg";
    });

    // Función de cálculo
    function calcularImpacto() {
        const kilosSemana = parseFloat(sliderKilos.value);
        const personas = parseInt(inputPersonas.value, 10) || 1;
        const tipoFactor = parseFloat(selectTipoAlimento.value); // Factor de emisión y coste

        // Cálculos anuales (52 semanas)
        const kilosTotalesAnio = kilosSemana * 52;
        // Cada kg de comida ahorrado evita entre 2.5 y 4.5 kg de CO2 según el tipo
        const co2Evitado = kilosTotalesAnio * tipoFactor;
        // Se estima un coste medio de 3.80 € por kilo de comida salvada
        const dineroAhorrado = kilosTotalesAnio * 3.80;

        // Mostrar valores redondeados en el DOM
        resKilosAnio.textContent = Math.round(kilosTotalesAnio);
        resCo2Anio.textContent = Math.round(co2Evitado);
        resEurosAnio.textContent = Math.round(dineroAhorrado) + " €";

        // Cambio dinámico de estilos y texto según el volumen de impacto
        if (kilosTotalesAnio >= 200) {
            badgeNivel.textContent = "Nivel 3: Campeón de la Sostenibilidad";
            badgeNivel.style.backgroundColor = "#16a34a"; // Verde intenso
            mensajeNivel.textContent = "¡Increíble labor! Tu hogar es un referente en aprovechamiento en València.";
        } else if (kilosTotalesAnio >= 80) {
            badgeNivel.textContent = "Nivel 2: Guardián de la Huerta";
            badgeNivel.style.backgroundColor = "#0284c7"; // Azul
            mensajeNivel.textContent = "¡Muy buen trabajo! Estás reduciendo significativamente tu huella de carbono.";
        } else {
            badgeNivel.textContent = "Nivel 1: Iniciado Verde";
            badgeNivel.style.backgroundColor = "#eab308"; // Amarillo
            mensajeNivel.textContent = "Buen comienzo. Con un poco más de planificación podrás ahorrar mucho más.";
        }
    }

    // Calcular al pulsar el botón
    btnCalcular.addEventListener("click", calcularImpacto);

    // Ejecutar una vez al inicio con los valores predeterminados
    calcularImpacto();
});
