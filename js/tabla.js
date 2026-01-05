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
   MANEJO DE DOM Y FORMULARIOS (INPUTS HIDDEN)
   ========================================== */

function wats() {
    var spanWatts = document.getElementById('totalWatts');
    var inputVoltaje = document.getElementById('voltaje');
    if (spanWatts && inputVoltaje) spanWatts.innerHTML = inputVoltaje.value;
}

function cambiarCategoria(nombreCategoria, idCategoriaPadre) {
    // Mapeo simple para asignar nombres a inputs hidden
    if (idCategoriaPadre == 100) document.getElementById('catProce').value = nombreCategoria;
    else if (idCategoriaPadre == 99) document.getElementById('catMobo').value = nombreCategoria;
    else if (idCategoriaPadre == 104 || idCategoriaPadre == 105) document.getElementById('catGpu').value = idCategoriaPadre;
}

function pasarId(idProducto, idCategoriaPadre, slots) {
    // Asigna IDs ocultos según la categoría
    const inputMap = {
        99: 'idMobo',
        103: 'idCase',
        101: 'idRam',
        102: 'idDisco', // Nota: En tu código original 102 (GPU) asignaba a idDisco. Lo mantengo así por orden estricta.
        109: 'idFuente'
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

        cambiarCategoria(nombreCategoria, idCategoriaPadre);
        pasarId(idProducto, idCategoriaPadre, flag);
        if (idCategoriaPadre == 99) document.getElementById('idMoboCat').value = idCategoria;
        cambiarClase(idCategoriaPadre);

        // 🔒 LÓGICA GPU OBLIGATORIA AL AGREGAR CPU
        if (idCategoriaPadre == 100) {
            document.getElementById('gpuNeed').value = gpu;
            if (gpu == 1) {
                let hayGpu = document.querySelector('tr[id^="fila102-"]');
                if (!hayGpu) resetearVisual(102, false); // false para no cambiar color de fondo
            }
        }

        if (voltaje > 0 && (idCategoriaPadre == 100 || idCategoriaPadre == 102)) {
            let factor = (idCategoriaPadre == 102) ? 1.1 : 1.8;
            calcularVoltaje(voltaje * factor);
            wats();
        }

        let subtotal = parseFloat(precioEfectivo * cantidad);
        let htmlFila = `
            <tr id="${idFila}">
                <td>
                    <input type="hidden" id="voltajeValor" value="${voltaje}">
                    <input type="hidden" id="idProducto" name="idProducto[]" value="${idProducto}">
                    <input type="hidden" id="idPadre" name="catePadre[]" value="${idCategoriaPadre}">
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

function eliminarFilas(boton) {
    var fila = boton.closest('tr');
    var idPadre = fila.querySelector('#idPadre').value;
    var wattsItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);

    // 1. Restar Voltaje del sistema
    var inputVoltaje = document.getElementById('voltaje');
    var nuevoVoltaje = (parseFloat(inputVoltaje.value) || 0) - wattsItem;
    inputVoltaje.value = Math.max(0, nuevoVoltaje);

    // 2. Limpiezas específicas según la categoría eliminada
    if (idPadre == 100) { // Si se elimina el CPU
        document.getElementById('voltajecpu').value = 0;
        document.getElementById('coolNeed').value = 0;
        document.getElementById('gpuNeed').value = 0; // Resetear requerimiento de GPU
        document.getElementById('socketCool').value = 0;
    } else if (idPadre == 102) { // Si se elimina la GPU
        document.getElementById('voltajegpu').value = 0;
    }

    // 3. Eliminar la fila del DOM y limpiar inputs ocultos
    fila.remove();
    eliminarHidden(idPadre);
    alertify.error('Componente eliminado');

    // 4. Actualizar cálculos generales
    actualizarTotales();
    wats();
    
    // 5. Actualizar iconos visuales
    elimClase(idPadre); 
    
    // 🔒 VÍNCULO DINÁMICO: Si el componente borrado fue el CPU, 
    // obligamos a la categoría GPU (102) a re-evaluar su icono.
    if (idPadre == 100) {
        elimClase(102);
    }
}


/* ==========================================
   LÓGICA DE LIMPIEZA EN CASCADA (COMPLEJO)
   ========================================== */

function eliminarHidden(idCategoria) {
    idCategoria = parseInt(idCategoria);

    // 1. JERARQUÍA (Orden estricto de cascada)
    const ordenCascada = [
        100, // PROCESADOR
        99,  // PLACA BASE
        103, // GABINETE
        101, // MEMORIA RAM
        102, // TARJETA GRÁFICA
        109, // FUENTE DE PODER
        118, // UNIDADES DE DATOS
        104, // COOLER DE AIRE
        105, // COOLER DE LÍQUIDO
        110, // PERIFERICOS (Teclado)
        111, // PERIFERICOS (Mouse)
        113, // PERIFERICOS (Audífonos)
        119, // MONITORES
        122  // UPS
    ];

    const indiceInicio = ordenCascada.indexOf(idCategoria);
    if (indiceInicio === -1) return;

    // Inputs a limpiar
    const inputsMap = {
        100: document.getElementById('catProce'),
        99:  document.getElementById('idMobo'),
        103: document.getElementById('idCase'),
        101: document.getElementById('idRam'),
        102: document.getElementById('idGpu'),
        109: document.getElementById('idFuente'),
        118: document.getElementById('idDisco')
    };

    const inputVoltaje = document.getElementById('voltaje');
    const opcionales = [110, 111, 113, 119, 122]; // Se ponen en Amarillo

    // 2. BUCLE EN CASCADA
    for (let i = indiceInicio; i < ordenCascada.length; i++) {
        let catActual = ordenCascada[i];
        
        // Buscamos si hay productos agregados en esta categoría
        let filas = document.querySelectorAll(`tr[id^="fila${catActual}"]`);
        let teniaProductos = filas.length > 0;
        
        // ¿Debemos cambiar el icono/color?
        // SI es la categoría que el usuario clickeó borrar (idCategoria) -> SI
        // SI es una categoría inferior Y tenía productos dentro -> SI
        // SI es una categoría inferior Y estaba vacía -> NO (No la tocamos)
        let debeResetearVisual = (catActual === idCategoria) || teniaProductos;

        // --- A. LIMPIEZA DE DOM Y VOLTAJE ---
        filas.forEach(fila => {
            let voltajeItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);
            if (voltajeItem > 0) {
                let voltajeTotal = parseFloat(inputVoltaje.value) || 0;
                inputVoltaje.value = Math.max(0, voltajeTotal - voltajeItem);
            }
            fila.remove();
        });

        // --- B. LIMPIEZA DE INPUTS HIDDEN ---
        if (inputsMap[catActual]) inputsMap[catActual].value = '';

        // --- C. LIMPIEZAS ESPECÍFICAS DE LÓGICA ---
        if (catActual === 100) { 
            document.getElementById('catMobo').value = ''; 
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('socketCool').value = 0;
            document.getElementById('coolNeed').value = 0;
            document.getElementById('gpuNeed').value = 0;
            $('#collapseCpu').collapse('hide');
        } else if (catActual === 99) {
            document.getElementById('catMobo').value = '';
            document.getElementById('slotsMobo').value = 0;
        } else if (catActual === 102) {
            document.getElementById('voltajegpu').value = 0;
        }

        // --- D. CAMBIO VISUAL CONDICIONAL ---
        if (debeResetearVisual) {
            let elIcono = document.getElementById(catActual);
            if (elIcono) {
                if (opcionales.includes(catActual)) {
                    // MODO AMARILLO (Advertencia)
                    $(elIcono).removeClass('fas fa-check fas fa-times').addClass('fas fa-exclamation');
                    elIcono.style.color = '#ff7b11'; 
                    $(elIcono).closest('.card').css('background', '#FEFFC5'); 
                    $(elIcono).closest('.card-header').css('background', ''); 
                } else {
                    // MODO ROJO (Error/Reset normal)
                    resetearVisual(catActual);
                }
            }
        }
    }

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
    //$(el).closest('h2').css('background', '#BCFFD6'); // Opcional, dependiendo de estructura HTML exacta
}

function resetearVisual(id, alerta = true) {
    var el = document.getElementById(id);
    if (!el) return;

    $(el).removeClass('fas fa-check').addClass('fas fa-times');
    el.style.color = 'red';

    // Fondo rojo claro
    if (alerta) $(el).closest('.card-header').css('background', '#FFD3D3');
}

function elimClase(idCategoria) {
    // Si todavía hay productos de esta categoría en la lista, no cambiamos el icono
    if (document.querySelectorAll(`tr[id^="fila${idCategoria}-"]`).length > 0) return;

    var el = document.getElementById(idCategoria);
    if (!el) return;

    // 1. CORRECCIÓN AQUÍ:
    // Movimos 103 (Gabinete), 118 (Discos) y agregué 109 (Fuente) a CRÍTICAS para que se pongan ROJOS.
    const criticas = [100, 99, 101, 103, 118, 109]; 
    
    // Quitamos esos IDs de opcionales
    const opcionales = [104, 105, 110, 113, 111, 119, 122]; 

    // Limpiar todas las clases de iconos posibles antes de asignar la nueva
    $(el).removeClass('fas fa-check fa-times fa-exclamation');

    if (criticas.includes(parseInt(idCategoria))) {
        // Estado: X Roja y fondo rojo (Crítico)
        resetearVisual(idCategoria);
    } 
    else if (idCategoria == 102) {
        // Lógica dinámica para la GPU
        let requiereGpu = document.getElementById('gpuNeed').value;
        
        if (requiereGpu == 1) {
            // Caso: El procesador actual EXIGE gráfica dedicada -> Se pone ROJO
            resetearVisual(102, false); 
        } else {
            // Caso: El procesador tiene integradas -> Se pone AMARILLO
            $(el).addClass('fas fa-exclamation');
            el.style.color = '#ff7b11'; 
            $(el).closest('.card-header').css('background', ''); 
        }
    }
    else if (opcionales.includes(parseInt(idCategoria))) {
        // Estado: Signo de admiración naranja (Opcional)
        $(el).addClass('fas fa-exclamation');
        el.style.color = '#ff7b11';
        $(el).closest('.card-header').css('background', ''); 
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

    // 1. Validar orden de inserción (CPU y Placa base primero)
    if (filasTabla < 3 && (idCategoriaPadre != 100 && idCategoriaPadre != 99)) {
        alertify.error('Antes debes agregar un procesador y una placa base');
        return true;
    }

    // 2. CATEGORÍAS MÚLTIPLES (RAM, Almacenamiento, Monitores, Periféricos)
    // Retornamos 'false' para que la ejecución SIGA hacia agregarTabla y se pueda sumar.
    if ([101, 118, 119, 110, 111, 113].includes(parseInt(idCategoriaPadre))) {
        return false;
    }

    // 3. VALIDACIÓN ESPECIAL DE COOLERS
    if (idCategoriaPadre == 104 || idCategoriaPadre == 105) {
        let existeCooler = document.querySelector('tr[id^="fila104-"]') || document.querySelector('tr[id^="fila105-"]');
        if (existeCooler) {
            alertify.error('Ya fue agregado un disipador');
            return true;
        }
        return false;
    }

    // 4. CATEGORÍAS ÚNICAS (CPU, Mobo, GPU, Fuente, Case, etc.)
    let existeDeLaCategoria = document.querySelector(`tr[id^="fila${idCategoriaPadre}-"]`);
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