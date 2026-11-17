/* ==========================================================================
   FICHERO: js/recetas.js
   RESPONSABLE: Miembro 2 del Equipo
   DESCRIPCIÓN: Lógica de Arrastrar y Soltar (Drag & Drop) nativo de HTML5
                para La Olla Virtual de Aprovechamiento (recetas.html).
   REQUISITOS CUBIERTOS:
     - Requisito d: Gestión de eventos de arrastre y suelta (dragstart, dragover, drop)
     - Detección de combinaciones de ingredientes
     - Manipulación del DOM y generación dinámica de recetas
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Módulo Drag & Drop de Recetas cargado correctamente.");

    // Referencias a los contenedores principales
    const despensa = document.getElementById("contenedor-despensa");
    const olla = document.getElementById("zona-olla");
    const listaOlla = document.getElementById("ingredientes-olla");
    const textoOllaVacia = document.getElementById("texto-olla-vacia");
    const btnCocinar = document.getElementById("btn-cocinar");
    const btnReiniciar = document.getElementById("btn-reiniciar-olla");
    const panelResultado = document.getElementById("resultado-receta");
    const tituloReceta = document.getElementById("titulo-receta");
    const descReceta = document.getElementById("desc-receta");
    const pasosReceta = document.getElementById("pasos-receta");

    // Todos los elementos arrastrables iniciales
    const ingredientes = document.querySelectorAll(".ingrediente-item");

    /* ----------------------------------------------------------------------
       PASO 1: CONFIGURAR EVENTOS DE ARRASTRE EN CADA INGREDIENTE (dragstart)
       Tal y como se vio en la práctica y en los ejemplos de clase
       ---------------------------------------------------------------------- */
    ingredientes.forEach(function (ingrediente) {
        // Aseguramos que sea arrastrable
        ingrediente.setAttribute("draggable", "true");

        ingrediente.addEventListener("dragstart", function (evento) {
            console.log("Evento dragstart: arrastrando " + ingrediente.id);
            // Guardamos el ID del elemento arrastrado en el dataTransfer
            evento.dataTransfer.setData("text/plain", ingrediente.id);
            ingrediente.style.opacity = "0.5";
        });

        ingrediente.addEventListener("dragend", function () {
            ingrediente.style.opacity = "1";
        });
    });

    /* ----------------------------------------------------------------------
       PASO 2: GESTIONAR LA ZONA DE DROP (LA OLLA)
       dragover, dragleave y drop
       ---------------------------------------------------------------------- */
    olla.addEventListener("dragover", function (evento) {
        // Obligatorio para permitir soltar (evita el comportamiento por defecto)
        evento.preventDefault();
        olla.classList.add("drag-sobre");
    });

    olla.addEventListener("dragleave", function () {
        olla.classList.remove("drag-sobre");
    });

    olla.addEventListener("drop", function (evento) {
        evento.preventDefault();
        olla.classList.remove("drag-sobre");

        // Recuperamos el ID del ingrediente transportado
        const idIngrediente = evento.dataTransfer.getData("text/plain");
        const elementoArrastrado = document.getElementById(idIngrediente);

        if (elementoArrastrado) {
            // Ocultamos el texto de olla vacía
            textoOllaVacia.style.display = "none";

            // Añadimos el ingrediente dentro de la lista de la olla
            listaOlla.appendChild(elementoArrastrado);
            console.log("Ingrediente " + idIngrediente + " añadido a la olla.");
        }
    });

    /* ----------------------------------------------------------------------
       PASO 3: COCINAR RECETA DE APROVECHAMIENTO
       ---------------------------------------------------------------------- */
    btnCocinar.addEventListener("click", function () {
        const ingredientesEnOlla = Array.from(listaOlla.children);

        if (ingredientesEnOlla.length === 0) {
            alert("¡La olla está vacía! Arrastra al menos un ingrediente desde la despensa.");
            return;
        }

        // Obtener la lista de nombres de ingredientes en la olla
        const nombres = ingredientesEnOlla.map(item => item.getAttribute("data-tipo"));

        // Lógica de recomendación de recetas valencianas de aprovechamiento
        let receta = {
            titulo: "Salteado Rápido de la Huerta",
            descripcion: "Una preparación sencilla para no desperdiciar nada de verdura ni proteína sobrante.",
            pasos: [
                "Calienta un chorrito de aceite de oliva virgen extra en una sartén grande.",
                "Pica los ingredientes introducidos y sofríelos a fuego medio durante 10 minutos.",
                "Sazona con una pizca de sal, pimienta y hierbas aromáticas al gusto.",
                "Sirve caliente y disfruta de una comida deliciosa sin desperdiciar nada."
            ]
        };

        if (nombres.includes("arroz") && (nombres.includes("verdura") || nombres.includes("tomate"))) {
            receta = {
                titulo: "Arroz Meloso de la Huerta (Aprovechamiento)",
                descripcion: "Plato estrella valenciano para dar una segunda vida a las verduras maduras.",
                pasos: [
                    "Sofríe los tomates bien maduros y las verduras troceadas en una cazuela.",
                    "Añade caldo de verduras sobrante o agua y lleva a ebullición.",
                    "Incorpora el arroz y deja cocer durante 16-18 minutos a fuego suave.",
                    "Deja reposar 3 minutos antes de servir bien meloso."
                ]
            };
        } else if (nombres.includes("pan") && nombres.includes("leche")) {
            receta = {
                titulo: "Torrijas Caseras de Pan Sobrante",
                descripcion: "El dulce tradicional por excelencia para salvar el pan duro del día anterior.",
                pasos: [
                    "Corta el pan duro en rebanadas gruesas de unos 2 centímetros.",
                    "Templa la leche con una piel de naranja y una ramita de canela.",
                    "Empapa bien las rebanadas en la leche aromatizada.",
                    "Pasa por la sartén o dora al horno con un toque de canela y miel."
                ]
            };
        } else if (nombres.includes("garbanzos") || nombres.includes("pollo")) {
            receta = {
                titulo: "Ropa Vieja Valenciana",
                descripcion: "Receta tradicional de aprovechamiento de los restos del puchero familiar.",
                pasos: [
                    "Desmenuza los restos de pollo y reserva los garbanzos cocidos.",
                    "Pica una cebolla y un diente de ajo y póchalos despacio en la sartén.",
                    "Añade el pollo y los garbanzos, salteando todo junto para que coja sabor.",
                    "Opcional: añade un toque de pimentón dulce de la Vera."
                ]
            };
        }

        // Mostrar resultados en la página
        tituloReceta.textContent = receta.titulo;
        descReceta.textContent = receta.descripcion;

        pasosReceta.innerHTML = "";
        receta.pasos.forEach(function (paso) {
            const li = document.createElement("li");
            li.textContent = paso;
            pasosReceta.appendChild(li);
        });

        panelResultado.style.display = "block";
    });

    /* ----------------------------------------------------------------------
       PASO 4: REINICIAR Y DEVOLVER INGREDIENTES A LA DESPENSA
       ---------------------------------------------------------------------- */
    btnReiniciar.addEventListener("click", function () {
        const ingredientesEnOlla = Array.from(listaOlla.children);

        ingredientesEnOlla.forEach(function (item) {
            despensa.appendChild(item);
        });

        textoOllaVacia.style.display = "block";
        panelResultado.style.display = "none";
        console.log("Despensa reiniciada.");
    });
});
