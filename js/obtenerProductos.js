$(document).ready(function() {

    // Variable global para almacenar el último componente seleccionado
    var idCategoriaPrincipal = null;

    // Lista de IDs de categorías que se deben actualizar
    var categoriasDependientes = [99, 103, 101, 102, 109, 104, 105];

    // 1. DETECTAR CLIC EN "AÑADIR"
    $(document).on('click', ".btn-agregar-producto", function() {
        var nuevoIdPrincipal = $(this).data('cate-principal');
        if (nuevoIdPrincipal) {
            idCategoriaPrincipal = nuevoIdPrincipal;

            categoriasDependientes.forEach(function(catId) {
                // Force reload = true para refrescar dependencias
                ejecutarCargaAsociados(idCategoriaPrincipal, catId, true);
            });
        }
    });

    // 2. DETECTAR CLIC EN EL ACORDEÓN
    $(document).on('click', "button[data-cat-id]", function() {
        var catIdClickeado = $(this).data('cat-id');

        if (categoriasDependientes.includes(catIdClickeado)) {
            // Se permite cargar si hay un principal, o si son categorías especiales que gestionan sus propias dependencias
            if (idCategoriaPrincipal || 
                [109, 104, 105, 99, 103].includes(catIdClickeado)) {
                ejecutarCargaAsociados(idCategoriaPrincipal, catIdClickeado, false);
            }
        }
    });

    // Función principal de carga
    function ejecutarCargaAsociados(principalId, padreId, forceReload) {

        var btnCategoria = $("button[data-cat-id='" + padreId + "']");
        var targetId = btnCategoria.data('target');

        if (!targetId) return;

        var contenedorBody = $(targetId).find('.card-body');

        if (contenedorBody.data('loaded') && !forceReload) {
            return;
        }

        // ============================================================
        // 1. CASO ESPECIAL: PLACA BASE (ID 99) -> DEPENDE DE PROCESADOR
        // ============================================================
        if (padreId == 99) {
            var idProceSeleccionado = $('#idProceCat').val(); // <--- OBTENER DEL HIDDEN PROCE

            if (idProceSeleccionado && idProceSeleccionado != 0) {
                principalId = idProceSeleccionado;
            } else {
                contenedorBody.html(
                    '<div class="alert alert-warning text-center">' +
                    '<i class="fas fa-exclamation-triangle"></i> ' +
                    'Por favor, primero selecciona un <b>Procesador</b>.</div>'
                );
                return; // Detener ejecución si no hay procesador
            }
        }

        // ============================================================
        // 2. CASO ESPECIAL: GABINETE (ID 103) -> DEPENDE DE PLACA BASE
        // ============================================================
        if (padreId == 103) {
            var idMoboSeleccionado = $('#idMoboCat').val(); // <--- OBTENER DEL HIDDEN MOBO

            if (idMoboSeleccionado && idMoboSeleccionado != 0) {
                principalId = idMoboSeleccionado;
            } else {
                contenedorBody.html(
                    '<div class="alert alert-warning text-center">' +
                    '<i class="fas fa-exclamation-triangle"></i> ' +
                    'Por favor, primero selecciona una <b>Placa Base</b>.</div>'
                );
                return; // Detener ejecución si no hay placa
            }
        }

        // ============================================================
        // 3. CASO ESPECIAL: FUENTE DE PODER (ID 109)
        // ============================================================
        if (padreId == 109) {
            var wattsRequeridos = $('#voltaje').val() || 0;

            $.ajax({
                url: 'ajax/obtener_fuentes.php',
                type: 'POST',
                data: {
                    watts: wattsRequeridos
                },
                beforeSend: function() {
                    if (contenedorBody.html().trim() === "") {
                        contenedorBody.html(
                            '<div class="text-center">' +
                            '<i class="fas fa-spinner fa-spin"></i> ' +
                            'Buscando fuentes compatibles (' + wattsRequeridos + 'W o más)...</div>'
                        );
                    }
                },
                success: function(response) {
                    contenedorBody.html(response);
                    contenedorBody.data('loaded', true);
                },
                error: function() {
                    contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
                }
            });
            return;
        }

        // ============================================================
        // 4. CASO ESPECIAL: COOLERS (ID 104 y 105) -> DEPENDE DE CASE
        // ============================================================
        if (padreId == 104 || padreId == 105) {
            var idCaseSeleccionado = $('#idCaseCat').val();

            if (idCaseSeleccionado && idCaseSeleccionado != 0) {
                principalId = idCaseSeleccionado;
            } else {
                contenedorBody.html(
                    '<div class="alert alert-warning text-center">' +
                    '<i class="fas fa-exclamation-triangle"></i> ' +
                    'Por favor, primero selecciona un <b>Gabinete</b>.</div>'
                );
                return;
            }
        }

        // ============================================================
        // 5. ASOCIACIÓN PLACA BASE (RAM 101 / GPU 102) -> DEPENDE DE MOBO
        // ============================================================
        if (padreId == 101 || padreId == 102) {
            var moboPrincipal = $('#idMoboCat').val();
            if (moboPrincipal && moboPrincipal != 0) {
                principalId = moboPrincipal;
            }
            // Nota: Si no hay mobo, caerá en el check final "if (!principalId)"
        }

        // ============================================================
        // EJECUCIÓN AJAX ESTÁNDAR (Para 99, 103, 101, 102, 100, 104, 105)
        // ============================================================
        
        // Si después de toda la lógica no tenemos un ID principal válido
        if (!principalId && padreId != 100) {
             // Opcional: Mostrar mensaje genérico si se intenta abrir sin dependencias
             // y no cayó en los return anteriores
             return; 
        }

        $.ajax({
            url: 'ajax/obtener_asociados.php',
            type: 'POST',
            data: {
                cate_principal: principalId,
                cate_padre: padreId
            },
            beforeSend: function() {
                // Spinner SOLO si está vacío
                if (contenedorBody.html().trim() === "") {
                    contenedorBody.html(
                        '<div class="text-center">' +
                        '<i class="fas fa-spinner fa-spin"></i> ' +
                        'Buscando componentes compatibles...</div>'
                    );
                }
            },
            success: function(response) {
                contenedorBody.html(response);
                contenedorBody.data('loaded', true);
            },
            error: function() {
                contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
            }
        });
    }
});