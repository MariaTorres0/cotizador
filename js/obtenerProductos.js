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
            console.log("Seleccionado ID: " + idCategoriaPrincipal + ". Recalculando asociados...");
            
            categoriasDependientes.forEach(function(catId) {
                 // Force reload = true
                 ejecutarCargaAsociados(idCategoriaPrincipal, catId, true);
            });
        }
    });

    // 2. DETECTAR CLIC EN EL ACORDEÓN
    $(document).on('click', "button[data-cat-id]", function() {
        var catIdClickeado = $(this).data('cat-id');

        if (categoriasDependientes.includes(catIdClickeado)) {
            if (idCategoriaPrincipal || catIdClickeado == 109) { // 109 puede cargar sin idPrincipal si hay voltaje
                // Force reload = false
                ejecutarCargaAsociados(idCategoriaPrincipal, catIdClickeado, false);
            }
        }
    });

    // Función principal de carga
    function ejecutarCargaAsociados(principalId, padreId, forceReload) {

        var btnCategoria = $("button[data-cat-id='" + padreId + "']");
        var targetId = btnCategoria.data('target'); 

        if (targetId) {
            var contenedorBody = $(targetId).find('.card-body');
            var contenidoActual = contenedorBody.html().trim();

            // Evitar recarga si ya hay contenido y no es forzada
            if (!forceReload && contenidoActual !== "" && !contenidoActual.includes("fa-spinner")) {
                return;
            }

            // ============================================================
            // ⚡ CASO ESPECIAL: FUENTE DE PODER (ID 109)
            // ============================================================
            if (padreId == 109) {
                var wattsRequeridos = $('#voltaje').val() || 0; // Obtener valor del hidden
                
                $.ajax({
                    url: 'ajax/obtener_fuentes.php',
                    type: 'POST',
                    data: {
                        watts: wattsRequeridos
                    },
                    beforeSend: function () {
                        contenedorBody.html(
                            '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Buscando fuentes compatibles ('+wattsRequeridos+'W o más)...</div>'
                        );
                    },
                    success: function (response) {
                        contenedorBody.html(response);
                    },
                    error: function () {
                        console.error("Error al cargar fuentes de poder.");
                        contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
                    }
                });
                return;
            }

            // ============================================================
            // 🔗 LÓGICA NORMAL (ASOCIACIONES) PARA EL RESTO
            // ============================================================
            
            // Validación RAM/GPU usan Placa Base
            if (padreId == 101 || padreId == 102) {
                var moboPrincipal = $('#idMoboCat').val();
                if (moboPrincipal && moboPrincipal != 0) {
                    principalId = moboPrincipal;
                }
            }

            // Si no es fuente y no hay principal (y no es el primer paso), salir
            if (!principalId && padreId != 100) return; 

            $.ajax({
                url: 'ajax/obtener_asociados.php',
                type: 'POST',
                data: {
                    cate_principal: principalId,
                    cate_padre: padreId
                },
                beforeSend: function () {
                    contenedorBody.html(
                        '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Buscando componentes compatibles...</div>'
                    );
                },
                success: function (response) {
                    contenedorBody.html(response);
                },
                error: function () {
                    console.error("Error al cargar productos asociados para la categoría: " + padreId);
                    contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
                }
            });
        }
    }
});