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

function eliminarFilas(boton) {
    var fila = boton.closest('tr');
    var idPadre = fila.querySelector('#idPadre').value;
    var wattsItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);

    // 1. Restar Voltaje del sistema
    var inputVoltaje = document.getElementById('voltaje');
    var nuevoVoltaje = (parseFloat(inputVoltaje.value) || 0) - wattsItem;
    inputVoltaje.value = Math.max(0, nuevoVoltaje);

    // --- NUEVO: DETECTAR SI EXISTE GPU ANTES DE BORRAR ---
    // Checamos si hay filas de la categoría 102 (GPU)
    var habiaGpu = document.querySelectorAll('tr[id^="fila102-"]').length > 0;
    // -----------------------------------------------------

    // 2. Limpiezas específicas
    if (idPadre == 100) { // Si se elimina el CPU
        document.getElementById('voltajecpu').value = 0;
        document.getElementById('coolNeed').value = 0;
        document.getElementById('gpuNeed').value = 0;
        document.getElementById('socketCool').value = 0;
    } else if (idPadre == 102) { // Si se elimina la GPU
        document.getElementById('voltajegpu').value = 0;
    }

    // 3. Eliminar la fila del DOM y cascada
    fila.remove();
    eliminarHidden(idPadre); // Esto borrará las filas de GPU si idPadre es 100
    alertify.error('Componente eliminado');

    // 4. Actualizar cálculos
    actualizarTotales();
    wats();

    // 5. Actualizar iconos visuales de la categoría borrada
    elimClase(idPadre);

    // Si elimino el 104, también reseteo el visual del 105 (a amarillo) y viceversa.
    if (idPadre == 104) elimClase(105);
    if (idPadre == 105) elimClase(104);

    // VÍNCULO DINÁMICO CPU -> GPU
    if (idPadre == 100) {
        // AQUÍ ESTA LA MAGIA:
        // Llamamos a elimClase para la GPU (102).
        // Le pasamos 'habiaGpu' (true/false) como segundo parámetro.
        // Si habiaGpu es true -> Pone fondo rojo + icono.
        // Si habiaGpu es false -> Solo cambia icono (sin fondo rojo).
        elimClase(102, habiaGpu);
    }
}

/* =======================================
   LÓGICA DE LIMPIEZA EN CASCADA
   ======================================= */

function eliminarHidden(idCategoria) {
    idCategoria = parseInt(idCategoria);
    const inputVoltaje = document.getElementById('voltaje');

    // 1. DEFINICIÓN DE DEPENDENCIAS (Quién elimina a quién)
    // Las categorías aisladas (Periféricos, Monitores, UPS) no están aquí porque no eliminan a nadie más.
    let idsAEliminar = [];

    switch (idCategoria) {
        case 100: // PROCESADOR: Elimina TODO excepto aislados (Monitor, Peri, UPS)
            idsAEliminar = [99, 103, 101, 102, 109, 118, 104, 105];
            break;
        case 99: // PLACA BASE: Elimina TODO excepto Procesador y aislados
            idsAEliminar = [103, 101, 102, 109, 118, 104, 105];
            break;
        case 103: // GABINETE: Solo elimina los Coolers
            idsAEliminar = [104, 105];
            break;
        default:
            // El resto (RAM, GPU, Fuente, Discos, Periféricos, etc.) solo se eliminan a sí mismos.
            idsAEliminar = [];
            break;
    }

    // Agregamos la propia categoría que se disparó para limpiarla también
    // (Usamos un Set para evitar duplicados si la lógica cambia futuro)
    let totalAEliminar = [...new Set([idCategoria, ...idsAEliminar])];

    // Inputs a limpiar (Mapa de IDs a Inputs Hidden)
    const inputsMap = {
        100: 'catProce', 99: 'idMobo', 103: 'idCase', 101: 'idRam',
        102: 'idGpu', 109: 'idFuente', 118: 'idDisco'
    };

    // 2. PROCESAR ELIMINACIÓN
    totalAEliminar.forEach(catActual => {

        // A. Verificar si tenía productos (para saber si poner el Card Rojo)
        // Buscamos filas en la tabla HTML
        let filas = document.querySelectorAll(`tr[id^="fila${catActual}"]`);
        let teniaProductos = filas.length > 0;

        // B. Limpieza del DOM y Voltaje (Si hay filas)
        filas.forEach(fila => {
            let voltajeItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);
            if (voltajeItem > 0) {
                let voltajeTotal = parseFloat(inputVoltaje.value) || 0;
                inputVoltaje.value = Math.max(0, voltajeTotal - voltajeItem);
            }
            fila.remove();
        });

        // C. Limpieza de Inputs Hidden Generales
        if (inputsMap[catActual]) {
            let input = document.getElementById(inputsMap[catActual]);
            if (input) input.value = '';
        }

        // D. Limpiezas Específicas de Lógica de Negocio
        if (catActual === 100) { // Si borramos CPU
            document.getElementById('catMobo').value = '';
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('socketCool').value = 0;
            document.getElementById('coolNeed').value = 0;
            document.getElementById('gpuNeed').value = 0;
            $('#collapseCpu').collapse('hide');
        } else if (catActual === 99) { // Si borramos Mobo
            document.getElementById('catMobo').value = '';
            document.getElementById('slotsMobo').value = 0;
        } else if (catActual === 102) { // Si borramos GPU
            document.getElementById('voltajegpu').value = 0;
        }

        // E. ACTUALIZACIÓN VISUAL (ICONOS Y COLORES)
        // Regla: El card rojo solo sale si la categoría tenía un producto
        // EXCEPCIÓN: Si es la categoría 102 (GPU) y se eliminó por cascada del CPU (100), 
        // no debe ponerse roja, debe ponerse naranja.

        if (catActual === 102 && idCategoria === 100) {
            // Caso especial: CPU eliminó a la GPU -> Resetear a Warning (Naranja)
            resetearVisualGpuWarning();
        } else if (teniaProductos || catActual === idCategoria) {
            // Si tenía productos o es la categoría clickeada -> Resetear visualmente (Rojo o Amarillo según tipo)
            elimClase(catActual, true); // true = forzar cambio de fondo si aplica
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

function elimClase(idCategoria, activarFondoRojo = false) {
    idCategoria = parseInt(idCategoria);

    // Si todavía hay productos de esta categoría, NO cambiamos nada
    if (document.querySelectorAll(`tr[id^="fila${idCategoria}-"]`).length > 0) return;

    var el = document.getElementById(idCategoria);
    if (!el) return;

    // Clasificación
    const categoriasAmarillas = [104, 105, 119, 122];
    const categoriasRojas = [99, 100, 101, 103, 109, 118, 110, 111, 113];

    // Limpiar clases previas
    $(el).removeClass('fas fa-check fa-times fa-exclamation');

    // --- LÓGICA GPU (102) ---
    if (idCategoria == 102) {
        let requiereGpu = document.getElementById('gpuNeed').value;

        if (requiereGpu == 1) {
            // Si es estrictamente necesaria por el CPU actual
            resetearVisual(102, true);
        } else {
            // Si es opcional o NO hay CPU (caso eliminar procesador)
            // SIEMPRE ponemos el signo de admiración
            $(el).addClass('fas fa-exclamation');
            el.style.color = '#ff7b11'; // Naranja

            // EL FONDO ROJO DEPENDE DE SI HABÍA PRODUCTO
            if (activarFondoRojo) {
                $(el).closest('.card-header').css('background', '#FFD3D3');
            } else {
                $(el).closest('.card-header').css('background', '');
            }
        }
    }
    // --- LÓGICA COOLERS ---
    else if (categoriasAmarillas.includes(idCategoria)) {
        $(el).addClass('fas fa-exclamation');
        el.style.color = '#ff7b11';
        $(el).closest('.card').css('background', '');
        $(el).closest('.card-header').css('background', '#FEFFC5');
    }
    // --- LÓGICA RESTO (Rojos) ---
    else if (categoriasRojas.includes(idCategoria)) {
        // En las demás categorías, si se llama a esta función es porque se borró,
        // así que aplicamos el estilo rojo estándar.
        resetearVisual(idCategoria, true);
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