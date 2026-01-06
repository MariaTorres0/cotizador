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
            // Se permite cargar si hay un principal, o si es Fuente(109) o si es Cooler(104/105) 
            // ya que estos últimos validan sus propios hiddens internos.
            if (idCategoriaPrincipal || catIdClickeado == 109 || catIdClickeado == 104 || catIdClickeado == 105) { 
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
                var wattsRequeridos = $('#voltaje').val() || 0;
                
                $.ajax({
                    url: 'ajax/obtener_fuentes.php',
                    type: 'POST',
                    data: { watts: wattsRequeridos },
                    beforeSend: function () {
                        contenedorBody.html(
                            '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Buscando fuentes compatibles ('+wattsRequeridos+'W o más)...</div>'
                        );
                    },
                    success: function (response) {
                        contenedorBody.html(response);
                    },
                    error: function () {
                        contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
                    }
                });
                return;
            }

            // ============================================================
            // 🧊 CASO ESPECIAL: COOLERS (ID 104 y 105)
            // ============================================================
            if (padreId == 104 || padreId == 105) {
                var idCaseSeleccionado = $('#idCaseCat').val(); // Leemos el hidden del Gabinete
                
                if (idCaseSeleccionado && idCaseSeleccionado != 0) {
                    principalId = idCaseSeleccionado; // Forzamos que el principal sea el Case
                } else {
                    contenedorBody.html(
                        '<div class="alert alert-warning text-center"><i class="fas fa-exclamation-triangle"></i> Por favor, primero selecciona un <b>Gabinete</b> para filtrar coolers compatibles con su tamaño.</div>'
                    );
                    return; // Detenemos la ejecución si no hay case
                }
            }

            // ============================================================
            // 🔗 LÓGICA DE ASOCIACIÓN PLACA BASE (RAM/GPU)
            // ============================================================
            if (padreId == 101 || padreId == 102) {
                var moboPrincipal = $('#idMoboCat').val();
                if (moboPrincipal && moboPrincipal != 0) {
                    principalId = moboPrincipal;
                }
            }

            // Si llegados a este punto no hay ID principal (y no es el inicio con CPU), salir
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