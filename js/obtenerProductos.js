$(document).ready(function () {

    // Variable global para almacenar el último componente seleccionado
    var idCategoriaPrincipal = null;

    // Lista de IDs de categorías que se deben actualizar
    var categoriasDependientes = [99, 103, 101, 102, 109, 104, 105];

    // DETECTAR CLIC EN "Agregar"
    $(document).on('click', ".btn-agregar-producto", function () {
        var nuevoIdPrincipal = $(this).data('cate-principal');
        if (nuevoIdPrincipal) {
            idCategoriaPrincipal = nuevoIdPrincipal;

            categoriasDependientes.forEach(function (catId) {
                ejecutarCargaAsociados(idCategoriaPrincipal, catId, true);
            });
        }
    });

    // DETECTAR CLIC EN EL ACORDEÓN
    $(document).on('click', "button[data-cat-id]", function (e) {
        e.preventDefault();

        var boton = $(this);
        var catIdClickeado = boton.data('cat-id');
        var targetId = boton.data('target');
        var elTarget = $(targetId);
        var contenedorBody = elTarget.find('.card-body');

        // ======================================
        // RESPALDO DEL CONTENIDO ORIGINAL 
        // ======================================
        // Si aun no hemos guardado el contenido original y lo que hay no es una alerta, guardamos los productos en memoria para no perderlos
        if (!contenedorBody.data('contenido-original') && contenedorBody.find('.alert').length === 0) {
            contenedorBody.data('contenido-original', contenedorBody.html());
        }

        // =========================================
        // LOGICA DE TOGGLE (ABRIR / CERRAR)
        // =========================================

        if (elTarget.hasClass('show')) {
            elTarget.collapse('hide');
            return;
        }

        // ================================
        // CONFIGURACION DEL ORDEN 
        // ================================

        var ordenSecuencia = {
            99: 100, 103: 99, 101: 103, 102: 101,
            109: 102, 118: 109, 104: 118, 105: 118
        };

        if (ordenSecuencia[catIdClickeado]) {
            var idRequerido = ordenSecuencia[catIdClickeado];
            var yaComproAnterior = document.querySelectorAll(`tr[id^="fila${idRequerido}-"]`).length > 0;

            if (!yaComproAnterior) {
                // Si no ha comprado el anterior, mostramos la alerta (sobreescribiendo el HTML)
                contenedorBody.html(
                    '<div class="alert alert-danger text-center m-0">' +
                    '<i class="fas fa-exclamation-triangle"></i> ' +
                    'Debe seleccionar los componentes en el orden de los botones.' +
                    '</div>'
                );

                elTarget.collapse('show');
                return;
            } else {
                // ==================================
                // RESTAURACION DEL CONTENIDO 
                // ==================================
                // Si ya compro el anterior, pero lo que se muestra es la alerta de bloqueo, restauramos los productos originales que guardamos
                if (contenedorBody.find('.alert').length > 0) {
                    var contenidoGuardado = contenedorBody.data('contenido-original');
                    if (contenidoGuardado) {
                        contenedorBody.html(contenidoGuardado);
                        restaurarEstadoVisual();
                    }
                }
            }
        }

        if (typeof categoriasDependientes !== 'undefined' && categoriasDependientes.includes(catIdClickeado)) {
            if ((typeof idCategoriaPrincipal !== 'undefined' && idCategoriaPrincipal) ||
                [109, 104, 105, 99, 103].includes(catIdClickeado)) {
                ejecutarCargaAsociados(idCategoriaPrincipal, catIdClickeado, false);
            }
        }

        elTarget.collapse('show');
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

        // =======================
        // CASOS ESPECIALES
        // =======================
        if (padreId == 99) {
            var idProceSeleccionado = $('#idProceCat').val();

            if (idProceSeleccionado && idProceSeleccionado != 0) {
                principalId = idProceSeleccionado;
            } else {
                return;
            }
        }

        if (padreId == 103) {
            var idMoboSeleccionado = $('#idMoboCat').val();

            if (idMoboSeleccionado && idMoboSeleccionado != 0) {
                principalId = idMoboSeleccionado;
            } else {
                return;
            }
        }

        if (padreId == 109) {
            var wattsRequeridos = $('#voltaje').val() || 0;

            $.ajax({
                url: 'ajax/obtener_fuentes.php',
                type: 'POST',
                data: {
                    watts: wattsRequeridos
                },
                beforeSend: function () {
                    if (contenedorBody.html().trim() === "") {
                        contenedorBody.html(
                            '<div class="text-center">' +
                            '<i class="fas fa-spinner fa-spin"></i> ' +
                            'Buscando fuentes compatibles (' + wattsRequeridos + 'W o más)...</div>'
                        );
                    }
                },
                success: function (response) {
                    contenedorBody.html(response);
                    contenedorBody.data('loaded', true);

                    restaurarEstadoVisual();
                },
                error: function () {
                    contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
                }
            });
            return;
        }

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

        // ============================
        // ASOCIACIÓN PLACA BASE 
        // ============================
        if (padreId == 101 || padreId == 102) {
            var moboPrincipal = $('#idMoboCat').val();
            if (moboPrincipal && moboPrincipal != 0) {
                principalId = moboPrincipal;
            }
        }

        if (!principalId && padreId != 100) {
            return;
        }

        $.ajax({
            url: 'ajax/obtener_asociados.php',
            type: 'POST',
            data: {
                cate_principal: principalId,
                cate_padre: padreId
            },
            beforeSend: function () {
                if (contenedorBody.html().trim() === "") {
                    contenedorBody.html(
                        '<div class="text-center">' +
                        '<i class="fas fa-spinner fa-spin"></i> ' +
                        'Buscando componentes compatibles...</div>'
                    );
                }
            },
            success: function (response) {
                contenedorBody.html(response);
                contenedorBody.data('loaded', true);

                restaurarEstadoVisual();
            },
            error: function () {
                contenedorBody.html('<div class="text-center text-danger">Error al cargar datos.</div>');
            }
        });
    }
});

function restaurarEstadoVisual() {
    // Obtenemos todos los IDs de productos que ya están en la tabla de la izquierda
    let productosEnTabla = [];
    document.querySelectorAll('#lista input[name="idProducto[]"]').forEach(input => {
        productosEnTabla.push(input.value);
    });

    // Recorremos los productos cargados en la derecha y los marcamos si coinciden
    productosEnTabla.forEach(id => {
        marcarCardVisualmente(id);
    });
}

function marcarCardVisualmente(idProducto) {
    let card = document.getElementById('card-prod-' + idProducto);
    if (card) {
        card.classList.remove('bg-light');
        card.classList.add('producto-agregado');

        let check = card.querySelector('.check-overlay');
        if (check) check.style.display = 'block';

        let btn = card.querySelector('.btn-agregar-producto');
        if (btn) {
            btn.innerHTML = 'Agregado';

            btn.classList.remove('btn-info');
            btn.classList.add('btn-success');
        }
    }
}