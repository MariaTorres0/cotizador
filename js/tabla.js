/* ==========================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   ========================================== */
   
// Mapeo de IDs de categorías a IDs de Acordeones HTML
const collapseMap = {
    100: 'collapseCpu',
    99: 'collapsePlaca',
    103: 'collapseCase',
    101: 'collapseRam',
    102: 'collapseGpu',
    109: 'collapseFuente',
    118: 'collapseUnidades',
    104: 'collapseAir',
    105: 'collapseLiqui',
    110: 'collapsePeri', 111: 'collapsePeri', 113: 'collapsePeri', // Varios a Periféricos
    119: 'collapseMoni',
    122: 'collapseUps'
};

// Categorías que NO deben cerrar el menú al seleccionarse
const mantenerAbierto = [101, 118, 110, 111, 119, 113];

// Categorías obligatorias básicas para validar (IDs)
const catsCriticas = ['fila100', 'fila101', 'fila102', 'fila109', 'fila103']; // CPU, Mobo, GPU, Fuente, Case

window.onload = mostrarAlertaBienvenida;

/* ==========================================
   FUNCIONES DE UI Y NAVEGACIÓN
   ========================================== */

function mostrarAlertaBienvenida() {
    Swal.fire({
        icon: 'success',
        title: 'Recuerda que...',
        text: 'El precio final de tu configuración tendrá un BUEN DESCUENTO cuando envíes tu cotización a KPC.'
    });
}

function cerrarMenu(idCategoriaPadre) {
    // Si la categoría esta en la lista de mantener abierta no hacemos nada
    if (mantenerAbierto.includes(parseInt(idCategoriaPadre))) return;

    const idCollapse = collapseMap[idCategoriaPadre];
    if (idCollapse) {
        $('#' + idCollapse).collapse('hide');
    }
}

/* ====================================
   LÓGICA DE VALIDACIÓN Y CALCULOS
   ==================================== */

function validarTabla() {
    const filasTabla = document.getElementById('lista').rows;
    const categoriasEnTabla = [];

    // Obtener qué categorias estan presentes
    for (let i = 0; i < filasTabla.length; i++) {
        let idFila = filasTabla[i].id;
        let idPadre = idFila.split('-')[0].replace('fila', '');
        categoriasEnTabla.push(parseInt(idPadre));
    }

    // Variables de estado
    const tieneGpu = categoriasEnTabla.includes(102);
    const tieneCooler = categoriasEnTabla.includes(104) || categoriasEnTabla.includes(105);
    const gpuObligatoria = document.getElementById('gpuNeed').value == 1;
    const coolerObligatorio = document.getElementById('coolNeed').value == 1;

    // VALIDACIÓN BASICA INICIAL 
    const basicos = [100, 99, 103]; 
    const faltaBasico = basicos.some(id => !categoriasEnTabla.includes(id));

    if (categoriasEnTabla.length === 0 || faltaBasico) {
        alertify.error('¡Hace falta incorporar al menos un componente básico para armar su CPU!');
        return;
    }

    // VALIDACIÓN SECUENCIAL PERSONALIZADA

    // MEMORIA RAM (101)
    if (!categoriasEnTabla.includes(101)) {
        alertify.error('La configuración requiere MEMORIA RAM');
        return;
    }

    // TARJETA GRÁFICA (102)
    if (gpuObligatoria && !tieneGpu) {
        alertify.error('La configuración seleccionada requiere TARJETA GRÄFICA');
        return;
    }

    // FUENTE DE PODER (109)
    if (!categoriasEnTabla.includes(109)) {
        alertify.error('La configuración requiere FUENTE DE PODER');
        return;
    }

    // UNIDADES DE DATOS (118)
    if (!categoriasEnTabla.includes(118)) {
        alertify.error('La configuración requiere UNIDADES DE DATOS');
        return;
    }

    // COOLERS
    if (coolerObligatorio && !tieneCooler) {
        alertify.error('La configuración seleccionada requiere DISIPADOR');
        return;
    }

    // SI PASO TODAS LAS VALIDACIONES
    $('#modalFinal').modal('show');
}

/* ======================================
   MANEJO DE DOM Y FORMULARIOS
   ====================================== */

function wats() {
    var spanWatts = document.getElementById('totalWatts');
    var vCpu = parseFloat(document.getElementById('voltajecpu').value) || 0;
    var vGpu = parseFloat(document.getElementById('voltajegpu').value) || 0;

    if (spanWatts) {
        // Mostramos la suma de ambos componentes procesados
        spanWatts.innerHTML = (vCpu + vGpu).toFixed(2);
    }
}

function cambiarCategoria(nombreCategoria, idCategoriaPadre) {
    // Mapeo simple para asignar nombres a inputs hidden
    if (idCategoriaPadre == 100) document.getElementById('catProce').value = nombreCategoria;
    else if (idCategoriaPadre == 99) document.getElementById('catMobo').value = nombreCategoria;
    else if (idCategoriaPadre == 104 || idCategoriaPadre == 105) document.getElementById('cooler').value = idCategoriaPadre;
}

function pasarId(idProducto, idCategoriaPadre, slots) {
    const inputMap = {
        99: 'idMobo',
        101: 'idRam',
        102: 'idGpu',
        103: 'idCase',
        109: 'idFuente',
        118: 'idDisco'
    };

    if (inputMap[idCategoriaPadre]) {
        let el = document.getElementById(inputMap[idCategoriaPadre]);
        if (el) el.value = idProducto;
    }

    if (idCategoriaPadre == 99) {
        document.getElementById('slotsMobo').value = slots;
    }
}

function calcularVoltaje(voltajeItem) {
    var inputTotal = document.getElementById('voltaje');
    var actual = parseFloat(inputTotal.value) || 0;
    inputTotal.value = (actual + parseFloat(voltajeItem));
}

function socket(socketType) {
    document.getElementById('socketCool').value = socketType;
}

/* ===============================
   GESTIÓN DE LA TABLA
   =============================== */

function agregarTabla(nombreProducto, precioNormal, precioEfectivo, cantidad, idProducto, idCategoria, idCategoriaPadre, nombreCategoria, flag, voltaje, cooler, gpu, socketVal) {

    if (buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precioEfectivo, nombreProducto)) return;

    let idFila = `fila${idCategoriaPadre}-${idProducto}`;
    let filaExistente = document.getElementById(idFila);
    let slotsDisponibles = parseInt(document.getElementById('slotsMobo').value) || 0;

    if (filaExistente) {
        let inputCanti = filaExistente.querySelector('#canti');
        let inputSubtotal = filaExistente.querySelector('#totalDetalle');
        let nuevaCantidad = parseInt(inputCanti.value) + parseInt(cantidad);

        if (idCategoriaPadre == 101) {
            let totalActualRams = 0;
            document.querySelectorAll('tr[id^="fila101-"] #canti').forEach(el => totalActualRams += parseInt(el.value));

            if (totalActualRams + cantidad > slotsDisponibles) {
                alertify.error('Ya has alcanzado los slots máximos de la placa base');
                return;
            }
            if (totalActualRams + cantidad === slotsDisponibles) {
                setTimeout(() => { $('#collapseRam').collapse('hide'); }, 300);
            }
        }

        let nuevoSubtotal = nuevaCantidad * precioEfectivo;
        inputCanti.value = nuevaCantidad;
        filaExistente.querySelector('td:nth-child(4)').innerHTML = `
            <input type="hidden" id="canti" name="cantidadEnviar[]" value="${nuevaCantidad}">
            ${nuevaCantidad}
            <input type="hidden" id="cantidad" name="cantidad[]" value="${nuevaCantidad}">`;

        inputSubtotal.value = nuevoSubtotal;
        filaExistente.querySelector('td:nth-child(3)').innerHTML = `
            <input type="hidden" id="totalDetalle" name="totalDetalle[]" value="${nuevoSubtotal}">
            $${nuevoSubtotal.toFixed(2)}`;

        alertify.success('Cantidad actualizada');
    }
    else {
        if (idCategoriaPadre == 101) {
            let totalActualRams = 0;
            document.querySelectorAll('tr[id^="fila101-"] #canti').forEach(el => totalActualRams += parseInt(el.value));

            if (totalActualRams + cantidad > slotsDisponibles) {
                alertify.error('Ya has alcanzado los slots máximos de la placa base');
                return;
            }
            if (totalActualRams + cantidad === slotsDisponibles) {
                setTimeout(() => { $('#collapseRam').collapse('hide'); }, 300);
            }
        } else {
            cerrarMenu(idCategoriaPadre);
        }

        pasarId(idProducto, idCategoriaPadre, flag);

        if (idCategoriaPadre == 100) {
            document.getElementById('idProceCat').value = idCategoria; 
        }
        else if (idCategoriaPadre == 99) {
            document.getElementById('idMoboCat').value = idCategoria; 
        }
        else if (idCategoriaPadre == 103) {
            document.getElementById('idCaseCat').value = idCategoria; 
        }

        // Si el producto que estamos agregando es un procesador
        if (idCategoriaPadre == 100) {
            document.getElementById('gpuNeed').value = gpu;
            document.getElementById('coolNeed').value = cooler;


            if (cooler == 1) {
                [104, 105].forEach(idCool => {
                    let hayCooler = document.querySelector(`tr[id^="fila${idCool}-"]`);

                    if (!hayCooler) {
                        let elIcon = document.getElementById(idCool);
                        if (elIcon) {
                            $(elIcon).removeClass('fas fa-check fas fa-exclamation').addClass('fas fa-times');
                            elIcon.style.color = 'red';
                        }
                    }
                });
            }
        }

        if (idCategoriaPadre == 103) {
            document.getElementById('idCaseCat').value = idCategoria;
        }

        if (idCategoriaPadre == 99) document.getElementById('idMoboCat').value = idCategoria;
        cambiarClase(idCategoriaPadre);

        if (idCategoriaPadre == 104) cambiarClase(105);
        if (idCategoriaPadre == 105) cambiarClase(104);

        if (idCategoriaPadre == 100) {
            document.getElementById('gpuNeed').value = gpu;
            if (gpu == 1) {
                let hayGpu = document.querySelector('tr[id^="fila102-"]');
                if (!hayGpu) {
                    resetearVisual(102, false);
                }
            } else {
                let hayGpu = document.querySelector('tr[id^="fila102-"]');
                if (!hayGpu) resetearVisualGpuWarning();
            }
        }

        if (voltaje > 0 && (idCategoriaPadre == 100 || idCategoriaPadre == 102)) {
            let factor = (idCategoriaPadre == 102) ? 1.1 : 1.8;
            let voltajeProcesado = (voltaje * factor);

            if (idCategoriaPadre == 100) {
                document.getElementById('voltajecpu').value = voltajeProcesado.toFixed(2);
            } else if (idCategoriaPadre == 102) {
                document.getElementById('voltajegpu').value = voltajeProcesado.toFixed(2);
            }

            // Actualizamos el total general de voltaje 
            let vCpu = parseFloat(document.getElementById('voltajecpu').value) || 0;
            let vGpu = parseFloat(document.getElementById('voltajegpu').value) || 0;

            document.getElementById('voltaje').value = (vCpu + vGpu).toFixed(2);

            wats(); 
        }

        let subtotal = parseFloat(precioEfectivo * cantidad);

        let htmlFila = `
            <tr id="${idFila}">
                <td>
                    <input type="hidden" id="voltajeValor" value="${voltaje}">
                    <input type="hidden" id="idProducto" name="idProducto[]" value="${idProducto}">
                    <input type="hidden" id="idPadre" name="catePadre[]" value="${idCategoriaPadre}">
                    
                    <input type="hidden" id="nombreProducto" name="nombre[]" value="${nombreProducto}">
                    <input type="hidden" id="precioEfectivo" name="precioEfectivo[]" value="${precioEfectivo}">
                    <p>${nombreProducto}</p>
                </td>
                <td align="center">$${precioEfectivo.toFixed(2)}</td>
                <td align="center">
                    <input type="hidden" id="totalDetalle" name="totalDetalle[]" value="${subtotal}">
                    $${subtotal.toFixed(2)}
                </td>
                <td align="center">
                    <input type="hidden" id="canti" name="cantidadEnviar[]" value="${cantidad}">
                    ${cantidad}
                    <input type="hidden" id="cantidad" name="cantidad[]" value="${cantidad}">
                </td>
                <td>
                    <button onclick="eliminarFilas(this)" style="background: crimson; border-radius: 5px; color: #fff; border: none; padding: 5px 10px; cursor:pointer;" type="button">&times</button>
                </td>
            </tr>`;

        $('#lista tbody').append(htmlFila);
        alertify.success('Componente añadido');
        marcarCardVisualmente(idProducto);
    }

    actualizarTotales();
    if (idCategoriaPadre == 101) sacarCantidades(idCategoriaPadre);
}

/* ============================
   GESTIÓN DE LA TABLA 
   ============================ */

function eliminarFilas(boton) {
    var fila = boton.closest('tr')
    var inputIdProd = fila.querySelector('#idProducto');
    var idProductoAEliminar = inputIdProd ? inputIdProd.value : null;;
    var idPadre = parseInt(fila.querySelector('#idPadre').value);
    var wattsItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);
    var inputVoltaje = document.getElementById('voltaje');
    var nuevoVoltaje = (parseFloat(inputVoltaje.value) || 0) - wattsItem;
    inputVoltaje.value = Math.max(0, nuevoVoltaje);

       // Eliminacion masiva
    if (idPadre === 100 || idPadre === 99 || idPadre === 103) {

        if (idPadre === 100) {
            document.getElementById('idProceCat').value = "";
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('coolNeed').value = 0;
            document.getElementById('gpuNeed').value = 0;
            document.getElementById('socketCool').value = 0;
        }

        eliminarHidden(idPadre);
        alertify.error('Componente eliminado');

    } else {
        // Eliminacion individual
        fila.remove();
        if(idProductoAEliminar) desmarcarCardVisualmente(idProductoAEliminar);
        alertify.error('Componente eliminado');

        let selector = `tr[id^="fila${idPadre}-"]`;
        let quedanProductos = document.querySelectorAll(selector).length > 0;

        if (!quedanProductos) {

            // Limpiar inputs hidden
            const inputsMap = {
                101: 'idRam', 102: 'idGpu', 109: 'idFuente', 118: 'idDisco',
                104: 'cooler', 105: 'cooler'
            };
            if (inputsMap[idPadre]) {
                let input = document.getElementById(inputsMap[idPadre]);
                if (input) input.value = '';
            }
            if (idPadre === 102) document.getElementById('voltajegpu').value = 0;

            elimClase(idPadre, true);

            if (idPadre === 104) {
                elimClase(105, true);
            }
            if (idPadre === 105) {
                elimClase(104, true);
            }
        }
    }

    wats();
    actualizarTotales();
}

/* =======================================
   LÓGICA DE LIMPIEZA EN CASCADA
   ======================================= */

function eliminarHidden(idCategoria) {
    idCategoria = parseInt(idCategoria);
    const inputVoltaje = document.getElementById('voltaje');

    let hayCoolerAire = document.querySelectorAll('tr[id^="fila104-"]').length > 0;
    let hayCoolerLiquido = document.querySelectorAll('tr[id^="fila105-"]').length > 0;
    let huboCooler = hayCoolerAire || hayCoolerLiquido;

    // Definicion de dependencias
    let idsAEliminar = [];
    switch (idCategoria) {
        case 100:
            idsAEliminar = [99, 103, 101, 102, 109, 118, 104, 105, 999, 119, 122];
            break;
        case 99:
            idsAEliminar = [103, 101, 102, 109, 118, 104, 105, 999, 119, 122];
            break;
        case 103:
            idsAEliminar = [104, 105];
            break;
        default:
            idsAEliminar = [];
            break;
    }

    let totalAEliminar = [...new Set([idCategoria, ...idsAEliminar])];

    const inputsMap = {
        100: 'catProce', 99: 'idMobo', 103: 'idCase', 101: 'idRam',
        102: 'idGpu', 109: 'idFuente', 118: 'idDisco', 104: 'cooler', 105: 'cooler'
    };

    // PROCESAR ELIMINACION
    totalAEliminar.forEach(catActual => {
        catActual = parseInt(catActual);

        // Verificar si tenía productos (para el resto de categorías)
        let filas = document.querySelectorAll(`tr[id^="fila${catActual}-"]`);
        let teniaProductos = filas.length > 0;

        // Borrar filas y desmarcar visualmente
        filas.forEach(fila => {
            
            let inputIdProd = fila.querySelector('#idProducto');
            if (inputIdProd && inputIdProd.value) {
                desmarcarCardVisualmente(inputIdProd.value);
            }

            let voltajeItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);
            if (voltajeItem > 0) {
                let voltajeTotal = parseFloat(inputVoltaje.value) || 0;
                inputVoltaje.value = Math.max(0, voltajeTotal - voltajeItem);
            }
            fila.remove();
        });

        // Limpiar Inputs
        if (inputsMap[catActual]) {
            let input = document.getElementById(inputsMap[catActual]);
            if (input) input.value = '';
        }

        // Limpiezas Lógicas
        if (catActual === 100) $('#collapseCpu').collapse('hide');
        if (catActual === 99) {
            document.getElementById('catMobo').value = '';
            document.getElementById('slotsMobo').value = 0;
        }
        if (catActual === 102) document.getElementById('voltajegpu').value = 0;

        // ACTUALIZACIÓN VISUAL
        if (catActual === 104 || catActual === 105) {
            elimClase(catActual, huboCooler);
        } else {
            elimClase(catActual, teniaProductos);
        }
    });

    wats();
    actualizarTotales();
}

/* ==========================================
   ESTILOS Y VISUALIZACIÓN (ICONOS)
   ========================================== */

function cambiarClase(id) {
    var el = document.getElementById(id);
    if (!el) return;
    $(el).removeClass('fas fa-times fas fa-exclamation').addClass('fas fa-check');
    el.style.color = 'green';
    $(el).closest('.card-header').css('background', '#BCFFD6');
}

function resetearVisualGpuWarning() {
    var el = document.getElementById(102);
    if (!el) return;

    $(el).removeClass('fas fa-check fas fa-times').addClass('fas fa-exclamation');
    el.style.color = '#ff7b11'; 
}

function resetearVisual(id, alerta = true) {
    var el = document.getElementById(id);
    if (!el) return;

    $(el).removeClass('fas fa-check fas fa-exclamation').addClass('fas fa-times');
    el.style.color = 'red';

    if (alerta) {
        $(el).closest('.card-header').css('background', '#FFD3D3');
    } else {
    }
}

function elimClase(idCategoria, teniaProductos) {
    idCategoria = parseInt(idCategoria);
    var el = document.getElementById(idCategoria);

    if (!el && idCategoria === 999) el = document.getElementById('999') || document.getElementById('110');

    if (!el) return;

    // GRUPOS
    const grupoAmarillo = [102, 104, 105, 999, 119, 122];
    const grupoRojo = [100, 99, 101, 103, 109, 118];

    // Limpiar clases
    $(el).removeClass('fas fa-check fa-times fa-exclamation');

    // LOGICA GRUPO AMARILLO
    if (grupoAmarillo.includes(idCategoria)) {
        let esObligatorio = false;

        if (idCategoria === 102 && parseInt(document.getElementById('gpuNeed').value) === 1) esObligatorio = true;
        if ((idCategoria === 104 || idCategoria === 105) && parseInt(document.getElementById('coolNeed').value) === 1) esObligatorio = true;

        if (esObligatorio) {
            $(el).addClass('fas fa-times');
            el.style.color = 'red';
            if (teniaProductos) $(el).closest('.card-header').css('background', '#FFD3D3');
        } else {
            $(el).addClass('fas fa-exclamation');
            el.style.color = '#ff7b11'; 
            if (teniaProductos) $(el).closest('.card-header').css('background', '#FEFFC5');
        }
    }
    // LOGICA GRUPO ROJO
    else if (grupoRojo.includes(idCategoria)) {
        $(el).addClass('fas fa-times');
        el.style.color = 'red';
        if (teniaProductos) $(el).closest('.card-header').css('background', '#FFD3D3');
    }
}

/* ================================
   HELPERS Y UTILIDADES
   ================================ */

function actualizarTotales() {
    var inputsDetalle = document.querySelectorAll('#totalDetalle');
    var suma = 0;
    inputsDetalle.forEach(input => suma += parseFloat(input.value));

    // Efectivo
    document.querySelector('#totalVenta').textContent = ' ' + suma.toFixed(2);
    document.getElementById('totalVentaEfectivo').value = '$ ' + suma.toFixed(2);

    // Tarjeta
    obtenerValorFactor('FTJ').then(res => {
        let totalTarj = (suma / res.valor).toFixed(2);
        document.querySelector('#totalVentaTarjeta').textContent = ' ' + totalTarj;
        document.getElementById('totalVentaNormal').value = '$ ' + totalTarj;
    }).catch(err => console.error('Error factor:', err));
}

function totalizarVenta() { actualizarTotales(); }
function totalizarVentaNormal() { actualizarTotales(); }

function buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precio, nombre) {
    var filasTabla = document.getElementById('lista').rows.length;
    var idCat = parseInt(idCategoriaPadre);

    // Validar orden de insercion
    if (filasTabla < 3 && (idCat != 100 && idCat != 99)) {
        alertify.error('Antes debes agregar un procesador y una placa base');
        return true;
    }

    // CATEGORIAS MULTIPLES 
    if ([101, 118, 119, 110, 111, 113, 999].includes(idCat)) {
        return false;
    }

    // VALIDACION ESPECIAL DE COOLERS
    if (idCat == 104 || idCat == 105) {
        let existeCooler = document.querySelector('tr[id^="fila104-"]') || document.querySelector('tr[id^="fila105-"]');
        if (existeCooler) {
            alertify.error('Ya fue agregado un disipador');
            return true;
        }
        return false;
    }

    // CATEGORIAS UNICAS
    let existeDeLaCategoria = document.querySelector(`tr[id^="fila${idCat}-"]`);
    if (existeDeLaCategoria) {
        alertify.error('Ya existe un producto de esta categoría.');
        return true;
    }

    return false;
}

function recorrerTable(cantidad) {
    // Valida slots RAM
    let rams = document.querySelectorAll('tr[id^="fila101"]').length;
    let slots = parseInt(document.getElementById('slotsMobo').value) || 0;
    return (rams < slots);
}

function sacarCantidades(idCategoriaPadre) {
    if (idCategoriaPadre == 101) {
        let total = 0;
        document.querySelectorAll('#lista tr[id^="fila101"] #canti').forEach(el => total += parseFloat(el.value));
        document.querySelector('#totalCantidad').value = total;
    }
}

function buscarCooler() {
    var ids = [];
    var filas = document.querySelectorAll('tr[id^="fila105"]');
    filas.forEach(f => ids.push(f.id));
    return ids;
}


/* ============================
   FUNCIONES VISUALES
   ============================ */
function marcarCardVisualmente(idProducto) {
    let card = document.getElementById('card-prod-' + idProducto);
    if (card) {
        card.classList.remove('bg-light');
        card.classList.add('producto-agregado');

        let check = card.querySelector('.check-overlay');
        if (check) check.style.display = 'block';

        // Cambiar botón visualmente
        let btn = card.querySelector('.btn-agregar-producto');
        if (btn) {
            btn.innerHTML = 'Agregado';

            btn.classList.remove('btn-info');
            btn.classList.add('btn-success');
        }
    }
}

function desmarcarCardVisualmente(idProducto) {
    let card = document.getElementById('card-prod-' + idProducto);
    if (card) {
        card.classList.remove('producto-agregado');
        card.classList.add('bg-light');

        let check = card.querySelector('.check-overlay');
        if (check) check.style.display = 'none';

        // Restaurar botón
        let btn = card.querySelector('.btn-agregar-producto');
        if (btn) {
            btn.innerHTML = '+ Agregar';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-info');
        }
    }
}