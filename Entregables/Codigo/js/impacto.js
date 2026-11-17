// Responsable: Edu

document.addEventListener("DOMContentLoaded", function () {
    const sliderKilos = document.getElementById("slider-kilos");
    const spanKilosValor = document.getElementById("valor-kilos-slider");
    const inputPersonas = document.getElementById("input-personas");
    const selectTipoAlimento = document.getElementById("select-tipo-alimento");
    const btnCalcular = document.getElementById("btn-calcular-impacto");

    const resKilosAnio = document.getElementById("res-kilos-anio");
    const resCo2Anio = document.getElementById("res-co2-anio");
    const resEurosAnio = document.getElementById("res-euros-anio");
    const badgeNivel = document.getElementById("badge-nivel-sostenible");
    const mensajeNivel = document.getElementById("mensaje-nivel");

    // Actualizar valor del slider al moverlo
    sliderKilos.addEventListener("input", function () {
        spanKilosValor.textContent = sliderKilos.value + " kg";
    });

    function calcularImpacto() {
        const kilosSemana = parseFloat(sliderKilos.value);
        const personas = parseInt(inputPersonas.value, 10) || 1;
        const tipoFactor = parseFloat(selectTipoAlimento.value);

        const kilosTotalesAnio = kilosSemana * 52;
        const co2Evitado = kilosTotalesAnio * tipoFactor;
        const dineroAhorrado = kilosTotalesAnio * 3.80;

        resKilosAnio.textContent = Math.round(kilosTotalesAnio);
        resCo2Anio.textContent = Math.round(co2Evitado);
        resEurosAnio.textContent = Math.round(dineroAhorrado) + " €";

        // Cambiar nivel segun los kilos salvados
        if (kilosTotalesAnio >= 200) {
            badgeNivel.textContent = "Nivel 3: Campeon de la Sostenibilidad";
            badgeNivel.style.backgroundColor = "#16a34a";
            mensajeNivel.textContent = "Tu hogar es un referente en aprovechamiento en Valencia.";
        } else if (kilosTotalesAnio >= 80) {
            badgeNivel.textContent = "Nivel 2: Guardian de la Huerta";
            badgeNivel.style.backgroundColor = "#0284c7";
            mensajeNivel.textContent = "Estas reduciendo significativamente tu huella de carbono.";
        } else {
            badgeNivel.textContent = "Nivel 1: Iniciado Verde";
            badgeNivel.style.backgroundColor = "#eab308";
            mensajeNivel.textContent = "Con un poco mas de planificacion podras ahorrar mucho mas.";
        }
    }

    btnCalcular.addEventListener("click", calcularImpacto);
    calcularImpacto();
});
