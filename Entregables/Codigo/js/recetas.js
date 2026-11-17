// Responsable: Lora

document.addEventListener("DOMContentLoaded", function () {
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

    const cajaInfoRaton = document.getElementById("caja-info-raton");
    const infoRatonTitulo = document.getElementById("info-raton-titulo");
    const infoRatonTexto = document.getElementById("info-raton-texto");
    const infoRatonCoords = document.getElementById("info-raton-coords");

    const datosIngredientes = {
        "ing-arroz": "Arroz Bomba de la Albufera. Alimento no perecedero basico de la huerta valenciana.",
        "ing-tomate": "Tomate maduro de El Perello. Rico en antioxidantes, ideal para sofritos antes de que fermente.",
        "ing-verdura": "Verduras variadas de temporada. Perfectas para saltear o integrar en guisos melosos.",
        "ing-garbanzos": "Garbanzos cocidos. Gran aporte proteico para aprovechar en ropa vieja o ensaladas.",
        "ing-pollo": "Restos de carne de pollo. Ideal para desmenuzar e incorporar en salteados o croquetas.",
        "ing-pan": "Pan tradicional del dia anterior. Evita tirarlo utilizandolo en torrijas, migas o picatostes.",
        "ing-leche": "Leche entera pasteurizada. Consumir dentro de los 3 dias tras su apertura o cocinar postres."
    };

    const ingredientes = document.querySelectorAll(".ingrediente-item");

    ingredientes.forEach(function (ingrediente) {
        ingrediente.setAttribute("draggable", "true");

        // Eventos de arrastre
        ingrediente.addEventListener("dragstart", function (evento) {
            evento.dataTransfer.setData("text/plain", ingrediente.id);
            ingrediente.style.opacity = "0.5";
        });

        ingrediente.addEventListener("dragend", function () {
            ingrediente.style.opacity = "1";
        });

        // Deteccion de movimiento de raton
        ingrediente.addEventListener("mouseover", function () {
            const id = ingrediente.id;
            const texto = datosIngredientes[id] || "Ingrediente fresco para cocinar.";
            infoRatonTitulo.textContent = ingrediente.textContent;
            infoRatonTexto.textContent = texto;
            cajaInfoRaton.style.display = "block";
        });

        ingrediente.addEventListener("mousemove", function (evento) {
            infoRatonCoords.textContent = "X: " + evento.offsetX + "px, Y: " + evento.offsetY + "px";
        });

        ingrediente.addEventListener("mouseout", function () {
            cajaInfoRaton.style.display = "none";
        });
    });

    // Zona de soltar
    olla.addEventListener("dragover", function (evento) {
        evento.preventDefault();
        olla.classList.add("drag-sobre");
    });

    olla.addEventListener("dragleave", function () {
        olla.classList.remove("drag-sobre");
    });

    olla.addEventListener("drop", function (evento) {
        evento.preventDefault();
        olla.classList.remove("drag-sobre");

        const idIngrediente = evento.dataTransfer.getData("text/plain");
        const elementoArrastrado = document.getElementById(idIngrediente);

        if (elementoArrastrado) {
            textoOllaVacia.style.display = "none";
            listaOlla.appendChild(elementoArrastrado);
            guardarPersistenciaOlla();
        }
    });

    // Guardar estado en localStorage
    function guardarPersistenciaOlla() {
        const ids = Array.from(listaOlla.children).map(item => item.id);
        localStorage.setItem("nevera_olla_ingredientes", JSON.stringify(ids));
    }

    // Cargar estado de localStorage
    function cargarPersistenciaOlla() {
        const datos = localStorage.getItem("nevera_olla_ingredientes");
        if (datos) {
            try {
                const ids = JSON.parse(datos);
                if (ids && ids.length > 0) {
                    textoOllaVacia.style.display = "none";
                    ids.forEach(function (id) {
                        const elem = document.getElementById(id);
                        if (elem) {
                            listaOlla.appendChild(elem);
                        }
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    cargarPersistenciaOlla();

    // Generar receta segun los ingredientes de la olla
    btnCocinar.addEventListener("click", function () {
        const ingredientesEnOlla = Array.from(listaOlla.children);

        if (ingredientesEnOlla.length === 0) {
            alert("La olla esta vacia. Arrastra al menos un ingrediente desde la despensa.");
            return;
        }

        const nombres = ingredientesEnOlla.map(item => item.getAttribute("data-tipo"));

        let receta = {
            titulo: "Salteado Rapido de la Huerta",
            descripcion: "Una preparacion sencilla para no desperdiciar nada de verdura ni proteina sobrante.",
            pasos: [
                "Calienta un chorrito de aceite de oliva virgen extra en una sarten grande.",
                "Pica los ingredientes introducidos y sofrielos a fuego medio durante 10 minutos.",
                "Sazona con una pizca de sal, pimienta y hierbas aromaticas al gusto.",
                "Sirve caliente y disfruta de una comida deliciosa sin desperdiciar nada."
            ]
        };

        if (nombres.includes("arroz") && (nombres.includes("verdura") || nombres.includes("tomate"))) {
            receta = {
                titulo: "Arroz Meloso de la Huerta (Aprovechamiento)",
                descripcion: "Plato tradicional valenciano para dar una segunda vida a las verduras maduras.",
                pasos: [
                    "Sofrie los tomates bien maduros y las verduras troceadas en una cazuela.",
                    "Anade caldo de verduras sobrante o agua y lleva a ebullicion.",
                    "Incorpora el arroz y deja cocer durante 16-18 minutos a fuego suave.",
                    "Deja reposar 3 minutos antes de servir bien meloso."
                ]
            };
        } else if (nombres.includes("pan") && nombres.includes("leche")) {
            receta = {
                titulo: "Torrijas Caseras de Pan Sobrante",
                descripcion: "El dulce tradicional por excelencia para salvar el pan duro del dia anterior.",
                pasos: [
                    "Corta el pan duro en rebanadas gruesas de unos 2 centimetros.",
                    "Templa la leche con una piel de naranja y una ramita de canela.",
                    "Empapa bien las rebanadas en la leche aromatizada.",
                    "Pasa por la sarten o dora al horno con un toque de canela y miel."
                ]
            };
        } else if (nombres.includes("garbanzos") || nombres.includes("pollo")) {
            receta = {
                titulo: "Ropa Vieja Valenciana",
                descripcion: "Receta tradicional de aprovechamiento de los restos del puchero familiar.",
                pasos: [
                    "Desmenuza los restos de pollo y reserva los garbanzos cocidos.",
                    "Pica una cebolla y un diente de ajo y pochalos despacio en la sarten.",
                    "Anade el pollo y los garbanzos, salteando todo junto para que coja sabor.",
                    "Opcional: anade un toque de pimenton dulce de la Vera."
                ]
            };
        }

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

    // Vaciar olla y reiniciar
    btnReiniciar.addEventListener("click", function () {
        const ingredientesEnOlla = Array.from(listaOlla.children);

        ingredientesEnOlla.forEach(function (item) {
            despensa.appendChild(item);
        });

        textoOllaVacia.style.display = "block";
        panelResultado.style.display = "none";
        localStorage.removeItem("nevera_olla_ingredientes");
    });
});
