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
    // Si la categoría está en la lista de mantener abierto, no hacemos nada
    if (mantenerAbierto.includes(parseInt(idCategoriaPadre))) return;

    const idCollapse = collapseMap[idCategoriaPadre];
    if (idCollapse) {
        $('#' + idCollapse).collapse('hide');
    }
}

/* ==========================================
   LÓGICA DE VALIDACIÓN Y CÁLCULOS
   ========================================== */

function validarTabla() {
    var filasTabla = document.getElementById('lista').rows;
    var idsEncontrados = [];
    var inputTarjeta = document.getElementById('totalVentaNormal');
    var inputEfectivo = document.getElementById('totalVentaEfectivo');

    // Recolectar IDs existentes
    for (var i = 0; i < filasTabla.length; i++) {
        var idFila = filasTabla[i].id;
        var categoriaFila = idFila.split('-')[0];
        idsEncontrados.push(categoriaFila);

        // Lógica redundante original conservada por seguridad de negocio
        if (categoriaFila == 'fila100' || categoriaFila == 'fila101') {
            if (!idsEncontrados.includes('fila100')) idsEncontrados.push('fila100');
            if (!idsEncontrados.includes('fila101')) idsEncontrados.push('fila101');
        }
    }

    // Unique
    var idsUnicos = [...new Set(idsEncontrados)];

    // Definir requeridos según inputs 
    var definidos = [...catsCriticas];

    // Ajustes según lógica original de precios (aunque la lógica original era redundante, se respeta)
    if (inputEfectivo.value == 1 && inputTarjeta.value == 1) {
        definidos = ['fila100', 'fila118', 'fila101', 'fila102', 'fila109', 'fila103', 'fila104', 'fila105'];
    }
    // Nota: Los otros 'else if' en el original resultaban en la misma lista base, así que usamos la base.

    if (compare(idsUnicos, definidos)) {
        $('#modalFinal').modal('show');
    } else {
        alertify.error('¡Hace falta incorporar al menos un componente básico para armar su CPU!');
    }
}

function compare(seleccionados, requeridos) {
    seleccionados.sort();
    requeridos.sort();
    var faltantes = [];
    var coincidencias = 0;

    for (var i = 0; i < requeridos.length; i++) {
        if (seleccionados.includes(requeridos[i])) {
            coincidencias++;
        } else {
            faltantes.push(requeridos[i]);
        }
    }

    if (faltantes.length >= 1 && faltantes.length <= 3) {
        difere(faltantes);
        return false;
    }
    return coincidencias == requeridos.length;
}

function difere(faltantes) {
    // Si faltan los 3 básicos (CPU, Mobo, RAM)
    if (recorrer(faltantes)) {
        Swal.fire({
            icon: 'error',
            title: 'Revisa tu configuración',
            text: 'Por favor, agrega GPU y Cooler a tu configuración, ya que seleccionaste un procesador que lo requiere.'
        });
        return;
    }

    // Mensajes específicos
    for (var i = 0; i < faltantes.length; i++) {
        if (faltantes[i] == 'fila105') {
            alertify.error('La configuración seleccionada requiere cooler');
        } else if (faltantes[i] == 'fila104' || faltantes[i] == 'fila101') {
            alertify.error('La configuración seleccionada requiere tarjeta gráfica'); // Texto original mantenido
        }
    }
}

function recorrer(arrayFaltantes) {
    arrayFaltantes.sort();
    var checkArr = ['fila100', 'fila101', 'fila102']; // Orden: CPU, Mobo, RAM (según lógica original corregida al sort)
    // Nota: El original comparaba con ['fila102', 'fila100', 'fila101'], al ordenar ambos arrays, JSON.stringify funciona.
    return JSON.stringify(arrayFaltantes) == JSON.stringify(['fila100', 'fila101', 'fila102'].sort());
}

/* ==========================================
   MANEJO DE DOM Y FORMULARIOS
   ========================================== */

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

/* ==========================================
   GESTIÓN DE LA TABLA
   ========================================== */

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

        // GUARDAR ID DE CATEGORÍA SELECCIONADA EN HIDDENS ESPECÍFICOS
        if (idCategoriaPadre == 100) {
            document.getElementById('idProceCat').value = idCategoria; // Guarda la subcategoría del CPU
        }
        else if (idCategoriaPadre == 99) {
            document.getElementById('idMoboCat').value = idCategoria; // Guarda la subcategoría de la Placa
        }
        else if (idCategoriaPadre == 103) {
            document.getElementById('idCaseCat').value = idCategoria; // Guarda la subcategoría del Case
        }

        // Si el producto que estamos agregando es un Procesador
        if (idCategoriaPadre == 100) {
            // Guardamos si este procesador requiere GPU
            document.getElementById('gpuNeed').value = gpu;

            // Guardamos si este procesador requiere Cooler 
            document.getElementById('coolNeed').value = cooler;

            // ===============================================
            // LÓGICA AGREGADA: VISUALIZACIÓN COOLER OBLIGATORIO
            // ===============================================
            if (cooler == 1) {
                // Iteramos sobre las categorías de cooler (104: Aire, 105: Líquido)
                [104, 105].forEach(idCool => {
                    // Verificamos si YA hay un cooler seleccionado (para no quitar el check verde)
                    let hayCooler = document.querySelector(`tr[id^="fila${idCool}-"]`);
                    
                    if (!hayCooler) {
                        let elIcon = document.getElementById(idCool);
                        if (elIcon) {
                            // 1. Quitar check o exclamación y poner X roja
                            $(elIcon).removeClass('fas fa-check fas fa-exclamation').addClass('fas fa-times');
                            elIcon.style.color = 'red';
                        }
                    }
                });
            }
        }

        // --- LÓGICA PARA COMPATIBILIDAD DE CASE ---
        if (idCategoriaPadre == 103) {
            document.getElementById('idCaseCat').value = idCategoria;
        }

        if (idCategoriaPadre == 99) document.getElementById('idMoboCat').value = idCategoria;
        cambiarClase(idCategoriaPadre);

        // 2. SINCRONIZACIÓN VISUAL DE COOLERS
        if (idCategoriaPadre == 104) cambiarClase(105);
        if (idCategoriaPadre == 105) cambiarClase(104);

        // LÓGICA GPU OBLIGATORIA
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

            // GUARDAR EN LOS INPUTS ESPECÍFICOS
            if (idCategoriaPadre == 100) {
                document.getElementById('voltajecpu').value = voltajeProcesado.toFixed(2);
            } else if (idCategoriaPadre == 102) {
                document.getElementById('voltajegpu').value = voltajeProcesado.toFixed(2);
            }

            // Actualizamos el total general de voltaje (usando la suma de los específicos)
            let vCpu = parseFloat(document.getElementById('voltajecpu').value) || 0;
            let vGpu = parseFloat(document.getElementById('voltajegpu').value) || 0;
            
            document.getElementById('voltaje').value = (vCpu + vGpu).toFixed(2);
            
            wats(); // Llamamos a la función visual
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
    }

    actualizarTotales();
    if (idCategoriaPadre == 101) sacarCantidades(idCategoriaPadre);
}

/* ==========================================
   GESTIÓN DE LA TABLA (ELIMINACIÓN INDIVIDUAL)
   ========================================== */

/* ==========================================
   GESTIÓN DE LA TABLA (ELIMINACIÓN INDIVIDUAL)
   ========================================== */

function eliminarFilas(boton) {
    var fila = boton.closest('tr');
    var idPadre = parseInt(fila.querySelector('#idPadre').value); 
    var wattsItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);

    // 1. Restar Voltaje
    var inputVoltaje = document.getElementById('voltaje');
    var nuevoVoltaje = (parseFloat(inputVoltaje.value) || 0) - wattsItem;
    inputVoltaje.value = Math.max(0, nuevoVoltaje);

    // 2. Lógica de borrado Masivo (CPU/Mobo/Case) vs Individual
    if (idPadre === 100 || idPadre === 99 || idPadre === 103) {
        
        if (idPadre === 100) {
            document.getElementById('idProceCat').value = "";
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('coolNeed').value = 0;
            document.getElementById('gpuNeed').value = 0;
            document.getElementById('socketCool').value = 0;
        }

        eliminarHidden(idPadre);
        alertify.error('Componente y dependencias eliminados');
    
    } else {
        // 3. ELIMINACIÓN INDIVIDUAL
        fila.remove(); 
        alertify.error('Componente eliminado');

        // Verificamos si quedan MÁS productos de esa misma categoría
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

            // ACTUALIZACIÓN VISUAL PROPIA
            elimClase(idPadre, true);

            // --- SINCRONIZACIÓN FORZADA DE COOLERS ---
            // Si eliminamos Aire (104), obligamos a Líquido (105) a ponerse rojo también.
            // Pasamos 'true' porque la condición es "si hay producto en alguno".
            // Como acabamos de borrar uno manual, sabemos que SÍ había producto.
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
   LÓGICA DE LIMPIEZA EN CASCADA (ELIMINACIÓN MASIVA)
   ======================================= */

function eliminarHidden(idCategoria) {
    idCategoria = parseInt(idCategoria);
    const inputVoltaje = document.getElementById('voltaje');

    // 1. DETECTAR SI HAY ALGÚN COOLER ANTES DE BORRAR NADA
    // Esto es vital para que la alerta visual afecte a ambos si uno de ellos existía.
    let hayCoolerAire = document.querySelectorAll('tr[id^="fila104-"]').length > 0;
    let hayCoolerLiquido = document.querySelectorAll('tr[id^="fila105-"]').length > 0;
    let huboCooler = hayCoolerAire || hayCoolerLiquido;

    // 2. Definición de dependencias
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

    // 3. PROCESAR ELIMINACIÓN
    totalAEliminar.forEach(catActual => {
        catActual = parseInt(catActual);

        // A. Verificar si tenía productos (para el resto de categorías)
        let filas = document.querySelectorAll(`tr[id^="fila${catActual}-"]`);
        let teniaProductos = filas.length > 0;

        // B. Borrar filas
        filas.forEach(fila => {
            let voltajeItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);
            if (voltajeItem > 0) {
                let voltajeTotal = parseFloat(inputVoltaje.value) || 0;
                inputVoltaje.value = Math.max(0, voltajeTotal - voltajeItem);
            }
            fila.remove();
        });

        // C. Limpiar Inputs
        if (inputsMap[catActual]) {
            let input = document.getElementById(inputsMap[catActual]);
            if (input) input.value = '';
        }

        // D. Limpiezas Lógicas
        if (catActual === 100) $('#collapseCpu').collapse('hide');
        if (catActual === 99) {
            document.getElementById('catMobo').value = '';
            document.getElementById('slotsMobo').value = 0;
        } 
        if (catActual === 102) document.getElementById('voltajegpu').value = 0;

        // E. ACTUALIZACIÓN VISUAL
        // Lógica Especial para Coolers: Usamos la bandera global 'huboCooler'
        if (catActual === 104 || catActual === 105) {
            elimClase(catActual, huboCooler);
        } else {
            // Para el resto (GPU, RAM, etc) usamos su propia verificación
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

    // Cambiar a Check Verde
    $(el).removeClass('fas fa-times fas fa-exclamation').addClass('fas fa-check');
    el.style.color = 'green';
    // Fondo verde claro
    $(el).closest('.card-header').css('background', '#BCFFD6');
}

// Función auxiliar para GPU cuando se elimina CPU
function resetearVisualGpuWarning() {
    var el = document.getElementById(102);
    if (!el) return;

    // Icono Warning Naranja, sin fondo rojo
    $(el).removeClass('fas fa-check fas fa-times').addClass('fas fa-exclamation');
    el.style.color = '#ff7b11'; // Naranja
    $(el).closest('.card-header').css('background', ''); // Fondo neutro
}

function resetearVisual(id, alerta = true) {
    var el = document.getElementById(id);
    if (!el) return;

    $(el).removeClass('fas fa-check fas fa-exclamation').addClass('fas fa-times');
    el.style.color = 'red';

    // Fondo rojo claro SOLO si alerta es true
    if (alerta) {
        $(el).closest('.card-header').css('background', '#FFD3D3');
    } else {
        $(el).closest('.card-header').css('background', '');
    }
}


/* ==========================================
   ESTILOS Y VISUALIZACIÓN (ICONOS)
   ========================================== */

function elimClase(idCategoria, teniaProductos) {
    idCategoria = parseInt(idCategoria);
    var el = document.getElementById(idCategoria);

    // FIX: Si es periféricos (999) y no encuentras el ID, busca los hijos visuales (110, 111, etc)
    // Asumiré que tienes un elemento visual principal. Si usas el ID 999 en el HTML (el <i> o el div), funcionará.
    // Si tus iconos tienen IDs 110, 111, 113 separados, necesitarías un bucle, pero según tu código anterior 
    // parece que Periféricos se agrupa visualmente. Si no, avísame.
    if (!el && idCategoria === 999) el = document.getElementById('999') || document.getElementById('110');
    
    if (!el) return;

    // --- GRUPOS ---
    const grupoAmarillo = [102, 104, 105, 999, 119, 122]; // Periféricos (999) es amarillo por defecto
    const grupoRojo = [100, 99, 101, 103, 109, 118];

    // Limpiar clases
    $(el).removeClass('fas fa-check fa-times fa-exclamation');
    $(el).closest('.card-header').css('background', ''); 

    // LÓGICA GRUPO AMARILLO
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
            el.style.color = '#ff7b11'; // Naranja
            if (teniaProductos) $(el).closest('.card-header').css('background', '#FEFFC5');
        }
    }
    // LÓGICA GRUPO ROJO
    else if (grupoRojo.includes(idCategoria)) {
        $(el).addClass('fas fa-times');
        el.style.color = 'red';
        if (teniaProductos) $(el).closest('.card-header').css('background', '#FFD3D3');
    }
}

/* ==========================================
   HELPERS Y UTILIDADES
   ========================================== */

function actualizarTotales() {
    var inputsDetalle = document.querySelectorAll('#totalDetalle');
    var suma = 0;
    inputsDetalle.forEach(input => suma += parseFloat(input.value));

    // Efectivo
    document.querySelector('#totalVenta').textContent = ' ' + suma.toFixed(2);
    document.getElementById('totalVentaEfectivo').value = '$ ' + suma.toFixed(2);

    // Tarjeta (Async)
    obtenerValorFactor('FTJ').then(res => {
        let totalTarj = (suma / res.valor).toFixed(2);
        document.querySelector('#totalVentaTarjeta').textContent = ' ' + totalTarj;
        document.getElementById('totalVentaNormal').value = '$ ' + totalTarj;
    }).catch(err => console.error('Error factor:', err));
}

// Funciones 'wrapper' para compatibilidad con llamadas legacy si existen
function totalizarVenta() { actualizarTotales(); }
function totalizarVentaNormal() { actualizarTotales(); }

function buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precio, nombre) {
    var filasTabla = document.getElementById('lista').rows.length;
    var idCat = parseInt(idCategoriaPadre);

    // 1. Validar orden de inserción
    if (filasTabla < 3 && (idCat != 100 && idCat != 99)) {
        alertify.error('Antes debes agregar un procesador y una placa base');
        return true;
    }

    // 2. CATEGORÍAS MÚLTIPLES (AQUÍ AGREGAMOS EL 999)
    // Agregamos , 999 al final del array
    if ([101, 118, 119, 110, 111, 113, 999].includes(idCat)) {
        return false;
    }

    // 3. VALIDACIÓN ESPECIAL DE COOLERS
    if (idCat == 104 || idCat == 105) {
        let existeCooler = document.querySelector('tr[id^="fila104-"]') || document.querySelector('tr[id^="fila105-"]');
        if (existeCooler) {
            alertify.error('Ya fue agregado un disipador');
            return true;
        }
        return false;
    }

    // 4. CATEGORÍAS ÚNICAS
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
    // El original sumaba +1 al array por cada fila encontrada.
    // Si queremos ver si CABE la nueva cantidad:
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