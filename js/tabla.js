/* ==========================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   ========================================== */
// Mapeo de IDs de categorías a IDs de Acordeones HTML
const collapseMap = {
    100: 'collapseCpu',
    99:  'collapsePlaca',
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
            if(!idsEncontrados.includes('fila100')) idsEncontrados.push('fila100');
            if(!idsEncontrados.includes('fila101')) idsEncontrados.push('fila101');
        }
    }

    // Unique
    var idsUnicos = [...new Set(idsEncontrados)]; 

    // Definir requeridos según inputs (Lógica original)
    var definidos = [...catsCriticas]; // Copia base
    
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
    if(spanWatts && inputVoltaje) spanWatts.innerHTML = inputVoltaje.value;
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
        if(el) el.value = idProducto;
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
   GESTIÓN DE LA TABLA (AGREGAR / ELIMINAR)
   ========================================== */

function agregarTabla(nombreProducto, precioNormal, precioEfectivo, cantidad, idProducto, idCategoria, idCategoriaPadre, nombreCategoria, flag, voltaje, cooler, gpu, socketVal) {
    
    // Verificaciones iniciales
    if (buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precioEfectivo, nombreProducto)) return;

    cerrarMenu(idCategoriaPadre);
    
    // Lógica RAM cantidad
    var cantidadReal = (idCategoriaPadre == 101 && cantidad > 1) ? 1 : cantidad;

    cambiarCategoria(nombreCategoria, idCategoriaPadre);
    pasarId(idProducto, idCategoriaPadre, flag);
    cambiarClase(idCategoriaPadre);

    // Cálculo Voltaje con márgenes de seguridad
    if (voltaje > 0 && (idCategoriaPadre == 100 || idCategoriaPadre == 102)) {
        let factor = (idCategoriaPadre == 102) ? 1.1 : 1.8;
        calcularVoltaje(voltaje * factor);
        wats();
    }

    var subtotal = parseFloat(precioEfectivo * cantidad); // Simplificado

    // Template String moderno para el HTML
    var htmlFila = `
        <tr id="fila${idCategoriaPadre}-${idProducto}">
            <td>
                <input type="hidden" id="voltajeValor" value="${voltaje}">
                <input type="hidden" id="idProducto" name="idProducto[]" value="${idProducto}">
                <input type="hidden" id="idPadre" name="catePadre[]" value="${idCategoriaPadre}">
                <p>
                    <input type="hidden" id="nombreProducto" name="nombre[]" value="${nombreProducto}">
                    ${nombreProducto}
                </p>
            </td>
            <td align="center">
                <input type="hidden" name="precioEfectivo[]" id="precioEfectivo" value="${precioEfectivo}">
                $${precioEfectivo.toFixed(2)}
            </td>
            <td align="center">
                <input type="hidden" id="totalDetalle" name="totalDetalle[]" value="${subtotal}">
                $${subtotal.toFixed(2)}
            </td>
            <td align="center">
                <input type="hidden" id="canti" name="cantidadEnviar[]" value="${cantidadReal}">
                ${cantidadReal}
                <input type="hidden" id="cantidad" name="cantidad[]" value="${cantidad}">
            </td>
            <td>
                <button onclick="eliminarFilas(this)" style="background: crimson; border-radius: 5px; color: #fff; cursor: pointer; font-size: 16px; border: solid crimson" type="button">&times</button>
            </td>
        </tr>`;

    // Validar Slots RAM
    if (idCategoriaPadre == 101 && !recorrerTable(cantidad)) {
        alertify.error('Ya has alcanzado los slots máximos de la placa base');
        $('#collapseRam').collapse('hide');
        return;
    }

    // Insertar fila
    $('#lista tbody').append(htmlFila);
    alertify.success('Componente añadido');

    actualizarTotales(); // Función unificada
    if (idCategoriaPadre == 101) sacarCantidades(idCategoriaPadre);
}

function eliminarFilas(boton) {
    var fila = boton.closest('tr');
    var idPadre = fila.querySelector('#idPadre').value;
    var wattsItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);

    // Restar Voltaje
    var inputVoltaje = document.getElementById('voltaje');
    var nuevoVoltaje = (parseFloat(inputVoltaje.value) || 0) - wattsItem;
    inputVoltaje.value = Math.max(0, nuevoVoltaje);

    // Limpiezas específicas por ID
    if (idPadre == 100) { // CPU
        document.getElementById('voltajecpu').value = 0;
        document.getElementById('coolNeed').value = 0;
        document.getElementById('gpuNeed').value = 0;
        document.getElementById('socketCool').value = 0;
    } else if (idPadre == 102) { // GPU
        document.getElementById('voltajegpu').value = 0;
    }

    fila.remove();
    
    eliminarHidden(idPadre);
    alertify.error('Componente eliminado');
    
    actualizarTotales();
    wats();
    elimClase(idPadre);
}

/* ==========================================
   LÓGICA DE LIMPIEZA EN CASCADA (COMPLEJO)
   ========================================== */

function eliminarHidden(idCategoria) {
    idCategoria = parseInt(idCategoria);
    
    const inputs = {
        mobo: document.getElementById('idMobo'),
        case: document.getElementById('idCase'),
        ram: document.getElementById('idRam'),
        gpu: document.getElementById('idGpu'),
        fuente: document.getElementById('idFuente'),
        disco: document.getElementById('idDisco'),
        catProce: document.getElementById('catProce'),
        catMobo: document.getElementById('catMobo'),
        voltTotal: document.getElementById('voltaje')
    };

    // Función helper interna para borrar filas dependientes
    const borrarDep = (idCat, inputRef) => {
        if (inputRef && inputRef.value && inputRef.value != "0") {
            $(`tr[id^="fila${idCat}"]`).remove();
            resetearVisual(idCat);
            inputRef.value = '';
            return true;
        }
        return false;
    };

    if (idCategoria === 100) { // CPU BORRADO (Borra casi todo)
        inputs.catProce.value = '';
        inputs.catMobo.value = '';
        $('#collapseCpu').collapse('hide');
        resetearVisual(100);

        borrarDep(99, inputs.mobo);
        borrarDep(101, inputs.ram);
        borrarDep(109, inputs.fuente);
        borrarDep(103, inputs.case);
        borrarDep(118, inputs.disco);

        // Reset Watts Total
        inputs.voltTotal.value = 0;
        document.getElementById('voltajecpu').value = 0;
        document.getElementById('voltajegpu').value = 0;

        if (inputs.gpu.value) borrarDep(102, inputs.gpu);

    } else if (idCategoria === 99) { // MOBO BORRADA
        inputs.catMobo.value = '';
        inputs.mobo.value = '';
        resetearVisual(99);
        borrarDep(101, inputs.ram);

    } else if (idCategoria === 102) { // GPU BORRADA
        let total = parseFloat(inputs.voltTotal.value) || 0;
        let gpuW = parseFloat(document.getElementById('voltajegpu').value) || 0;
        inputs.voltTotal.value = Math.max(0, total - gpuW);
        
        document.getElementById('voltajegpu').value = 0;
        inputs.gpu.value = '';
        resetearVisual(102);

    } else {
        // Borrados simples
        const mapSimple = {
            101: inputs.ram,
            109: inputs.fuente,
            118: inputs.disco,
            103: inputs.case,
            104: inputs.case // Posible duplicidad en lógica original, mantenida
        };

        if (mapSimple[idCategoria]) {
            mapSimple[idCategoria].value = '';
        }
        
        // Caso especial Cooler
        if (idCategoria === 105) {
            let c = buscarCooler();
            if(c && c.length > 0) $(`#${c[0]}`).remove();
        }

        resetearVisual(idCategoria);
    }
    wats();
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
    // Si aún quedan productos de esta categoría en la tabla, no cambiar iconos
    if (document.querySelectorAll(`tr[id^="fila${idCategoria}-"]`).length > 0) return;

    var el = document.getElementById(idCategoria);
    if (!el) return;

    // Categorías Opcionales (Cambian a Exclamación Naranja)
    const opcionales = [103, 105, 111, 118, 122]; 
    // Categorías Críticas (Cambian a X Roja)
    const criticas = [100, 99, 101, 102];

    if (criticas.includes(parseInt(idCategoria))) {
        resetearVisual(idCategoria);
    } else if (opcionales.includes(parseInt(idCategoria))) {
        $(el).removeClass('fas fa-check').addClass('fas fa-exclamation');
        el.style.color = '#ff7b11';
        $(el).closest('.card').css('background', '#FEFFC5'); // Color amarillo
    } else if (idCategoria == 104) { // Fuente lógica especial
        if (document.getElementById('gpuNeed').value == 1) {
             resetearVisual(104);
        } else {
             $(el).removeClass('fas fa-check').addClass('fas fa-exclamation');
             el.style.color = '#ff7b11';
             $(el).closest('.card').css('background', '#FEFFC5');
        }
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
    // Lógica para detectar si ya existe
    let selector = `tr[id^="fila${idCategoriaPadre}"]`;
    // Selectores específicos para almacenamiento/monitor que permiten duplicados de nombre
    if (idCategoriaPadre == 118 || idCategoriaPadre == 119) selector += ` #nombreProducto`;

    let elemento = document.querySelector(selector);
    let filas = document.getElementById('lista').rows.length;

    if (!elemento) {
        // Validar orden de inserción (CPU/Mobo primero)
        if (filas < 3 && (idCategoriaPadre != 100 && idCategoriaPadre != 99)) {
            alertify.error('Antes debes agregar un procesador y una placa base');
            return true;
        }
        // Validar Cooler duplicado
        if (document.getElementById('cooler').value.length > 1 && (idCategoriaPadre == 104 || idCategoriaPadre == 105)) {
            alertify.error('Ya fue agregado un disipador');
            return true;
        }
        return false;
    } else {
        // Ya existe producto de esta categoría
        if ([101, 118, 119].includes(parseInt(idCategoriaPadre))) {
            // Aquí iría la lógica de sumar cantidades si fuera necesario, 
            // actualmente el código original retornaba true para evitar duplicar fila visual
            actualizarTotales();
            wats();
            return true; 
        } else {
            alertify.error('Ya existe un producto de esta categoría.');
            return true;
        }
    }
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