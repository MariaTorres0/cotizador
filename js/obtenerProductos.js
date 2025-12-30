$(document).ready(function() {
    
    // Variable global para almacenar el último componente seleccionado
    var idCategoriaPrincipal = null;

    // Lista de IDs de categorías que se deben actualizar
    var categoriasDependientes = [99, 103, 101, 102, 109, 104, 105];

    // 1. DETECTAR CLIC EN "AÑADIR"
    // Esta función SIEMPRE fuerza la recarga de los dependientes
    $(document).on('click', ".btn-agregar-producto", function() {
        
        var nuevoIdPrincipal = $(this).data('cate-principal');
        
        if (nuevoIdPrincipal) {
            idCategoriaPrincipal = nuevoIdPrincipal;
            console.log("Seleccionado ID: " + idCategoriaPrincipal + ". Recalculando asociados...");
            
            // Aquí forzamos la carga (limpiamos y recargamos) para las categorías siguientes
            categoriasDependientes.forEach(function(catId) {
                 // Pasamos 'true' como tercer parámetro para indicar que FORZAMOS la recarga
                 ejecutarCargaAsociados(idCategoriaPrincipal, catId, true);
            });
        }
    });

    // 2. DETECTAR CLIC EN EL ACORDEÓN (PARA ABRIR/CERRAR)
    // Esta función SOLO carga si está vacío (evita borrar lo que ya existe al regresar)
    $(document).on('click', "button[data-cat-id]", function() {
        var catIdClickeado = $(this).data('cat-id');

        if (categoriasDependientes.includes(catIdClickeado)) {
            // Si ya seleccionamos algo antes, intentamos cargar
            if (idCategoriaPrincipal) {
                // Pasamos 'false' para NO forzar recarga si ya hay datos
                ejecutarCargaAsociados(idCategoriaPrincipal, catIdClickeado, false);
            }
        }
    });

    // Función principal de carga
    // forceReload = true: Borra lo que hay y trae nuevo (Usado al seleccionar producto)
    // forceReload = false: Si ya hay productos, no hace nada (Usado al navegar/regresar)
    function ejecutarCargaAsociados(principalId, padreId, forceReload) {
        var btnCategoria = $("button[data-cat-id='" + padreId + "']");
        var targetId = btnCategoria.data('target'); 
        
        if(targetId) {
            var contenedorBody = $(targetId).find('.card-body');
            var contenidoActual = contenedorBody.html().trim();

            // LÓGICA CLAVE: 
            // Si NO forzamos recarga Y ya tiene contenido, nos salimos.
            // Esto permite que al regresar al acordeón, los productos sigan ahí.
            if (!forceReload && contenidoActual !== "" && contenidoActual !== '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Buscando componentes compatibles...</div>') {
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
                    contenedorBody.html('<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Buscando componentes compatibles...</div>');
                },
                success: function(response) {
                    contenedorBody.html(response);
                },
                error: function() {
                    console.error("Error al cargar productos asociados para la categoría: " + padreId);
                    contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
                }
            });
        }
    }
});