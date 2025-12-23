$(document).ready(function() {
    
    // Variable global para almacenar el ID de la sub-subcategoría seleccionada
    var idProcesadorSeleccionado = null;

    // Lista de IDs de categorías que dependen del procesador
    var categoriasDependientes = [99, 103, 101, 102, 109, 104, 105];

    $(document).on('click', "button[data-level='subsub']", function() {
        idProcesadorSeleccionado = $(this).data('cat-id');
        
        console.log("Procesador ID seleccionado: " + idProcesadorSeleccionado);
        
        categoriasDependientes.forEach(function(catId) {
             ejecutarCargaAsociados(idProcesadorSeleccionado, catId);
        });
    });

    $(document).on('click', "button[data-cat-id]", function() {
        var catIdClickeado = $(this).data('cat-id');

        if (categoriasDependientes.includes(catIdClickeado)) {
            if (!idProcesadorSeleccionado) {
                return;
            }
            ejecutarCargaAsociados(idProcesadorSeleccionado, catIdClickeado);
        }
    });

    function ejecutarCargaAsociados(principalId, padreId) {
        var btnCategoria = $("button[data-cat-id='" + padreId + "']");
        var targetId = btnCategoria.data('target'); 
        var contenedorBody = $(targetId).find('.card-body');

        $.ajax({
            url: 'ajax/obtener_asociados.php',
            type: 'POST',
            data: {
                cate_principal: principalId,
                cate_padre: padreId
            },
            beforeSend: function() {
                if(contenedorBody.html().trim() === "") {
                    contenedorBody.html('<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>');
                }
            },
            success: function(response) {
                contenedorBody.html(response);
            },
            error: function() {
                console.error("Error al cargar productos asociados para la categoría: " + padreId);
            }
        });
    }
});