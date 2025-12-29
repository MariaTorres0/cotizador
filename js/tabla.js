// Muestra la alerta de bienvenida
function mostrarAlertaBienvenida() {
    Swal.fire({
        icon: 'success',
        title: 'Recuerda que...',
        text: 'El precio final de tu configuración tendrá un BUEN DESCUENTO cuando envíes tu cotización a KPC.'
    });
}

window.onload = mostrarAlertaBienvenida;

// Cierra los acordeones del menu lateral al seleccionar un producto
function cerrarMenu(idCategoriaPadre) {
    var idCollapse = '';
    // Mapeo de IDs de categorías a los IDs de los acordeones en el HTML
    if (idCategoriaPadre == 100) { // CPU
        idCollapse = 'collapseCpu';
    } else if (idCategoriaPadre == 99) { // Mobo
        idCollapse = 'collapsePlaca';
    } else if (idCategoriaPadre == 103) { //Case
        idCollapse = 'collapseCase';
    } else if (idCategoriaPadre == 101) { // RAM
        idCollapse = 'collapseRam';
    } else if (idCategoriaPadre == 102) { // GPU
        idCollapse = 'collapseGpu';
    } else if (idCategoriaPadre == 109) { // Fuente
        idCollapse = 'collapseFuente';
    } else if (idCategoriaPadre == 118) { // Almacenamiento
        idCollapse = 'collapseUnidades';
    } else if (idCategoriaPadre == 104) { // Cooler de aire
        idCollapse = 'collapseAir';
    } else if (idCategoriaPadre == 105) { // Cooler de liquido
        idCollapse = 'collapsLiqui';
    } else if (idCategoriaPadre == 110 || idCategoriaPadre == 111 || idCategoriaPadre == 113) { // Perifericos
        idCollapse = 'collapsePeri'; 
    } else if (idCategoriaPadre == 119) { // Monitor
        idCollapse = 'collapseMoni';
    } else if (idCategoriaPadre == 122) { // UPS
        idCollapse = 'collapseUps';
    }

    // Cierra el acordeón si no es uno de los especificados en el if vacío
    if (idCategoriaPadre == 101 || idCategoriaPadre == 118 || idCategoriaPadre == 110 || idCategoriaPadre == 111 || idCategoriaPadre == 119 || idCategoriaPadre == 113) {
        // No hace nada (mantiene abierto)
    } else {
        if (idCollapse !== '') {
            $('#' + idCollapse).collapse('hide');
        }
    }
}

// Valida que todos los componentes obligatorios estén seleccionados antes de enviar
function validarTabla() {
    var filasTabla = document.getElementById('lista').rows;
    var idsEncontrados = new Array();
    var inputTarjeta = document.getElementById('totalVentaNormal'); // Input oculto
    var inputEfectivo = document.getElementById('totalVentaEfectivo'); // Input oculto

    // Recorre la tabla y guarda los IDs de las categorías encontradas
    for (var i = 0; i < filasTabla.length; i++) {
        var idFila = filasTabla[i].id;
        var categoriaFila = idFila.split('-')[0]; 

        // Lógica específica para categorías críticas (CPU y Motherboard)
        if (categoriaFila == 'fila100' || idFila.split('-')[0] == 'fila101') {
            idsEncontrados.push('fila100'); // Marca CPU como encontrado
            idsEncontrados.push('fila101'); // Marca Mobo como encontrada
        }
        idsEncontrados.push(categoriaFila);
    }

    // Filtra duplicados
    var idsUnicos = idsEncontrados.filter(function (valor, indice, self) {
        return self.indexOf(valor) === indice;
    });

    var definidos = [];

    // Define qué componentes son obligatorios basándose en si hay precio calculado
    // Nota: 100=CPU, 101=Mobo, 102=RAM, 109=Fuente, 103=Case, 118=Disco
    if (inputEfectivo.value == 1 && inputTarjeta.value == 1) {
        definidos = ['fila100', 'fila118', 'fila101', 'fila102', 'fila109', 'fila103', 'fila104', 'fila105'];
    } else if (inputEfectivo.value == 1 && inputTarjeta.value == 0) {
        // Lógica variante
        definidos = ['fila100', 'fila101', 'fila102', 'fila109', 'fila103'];
    } else if (inputTarjeta.value == 1 && inputEfectivo.value == 0) {
        definidos = ['fila100', 'fila101', 'fila109', 'fila102', 'fila103'];
    } else {
        // Default mínimos
        definidos = ['fila100', 'fila101', 'fila102', 'fila109', 'fila103'];
    }

    // Compara lo seleccionado con lo requerido
    if (compare(idsUnicos, definidos)) {
        $('#modalFinal').modal('show');
    } else {
        alertify.error('¡Hace falta incorporar al menos un componente básico para armar su CPU!');
    }
}

// Actualiza los Watts totales
function wats() {
    var spanWatts = document.getElementById('totalWatts');
    var inputVoltaje = document.getElementById('voltaje');
    spanWatts.innerHTML = inputVoltaje.value;
}

// Compara dos arrays (Ids seleccionados vs Ids requeridos)
function compare(seleccionados, requeridos) {
    seleccionados = seleccionados.sort();
    requeridos = requeridos.sort();
    var faltantes = new Array();
    var coincidencias = 0;

    for (var i = 0; i < requeridos.length; i++) {
        var encontrado = false;
        for (var j = 0; j < seleccionados.length; j++) {
            if (seleccionados[j] == requeridos[i]) {
                encontrado = true;
                coincidencias++;
            }
        }
        if (!encontrado) {
            faltantes.push(requeridos[i]);
        }
    }

    if (faltantes.length >= 1 && faltantes.length <= 3) {
        difere(faltantes);
        return false; // Retorna falso porque faltan cosas
    } else {
        return coincidencias == requeridos.length;
    }
}

// Muestra alertas específicas sobre qué falta
function difere(faltantes) {
    var mensaje = '';
    // Si falta todo lo básico
    if (recorrer(faltantes)) {
        Swal.fire({
            icon: 'error',
            title: 'Revisa tu configuración',
            text: 'Por favor, agrega GPU y Cooler a tu configuración, ya que seleccionaste un procesador que lo requiere.'
        });
    } else {
        for (var i = 0; i < faltantes.length; i++) {
            if (faltantes[i] == 'fila105') { // Cooler
                mensaje = 'La configuración seleccionada requiere cooler';
            } else if (faltantes[i] == 'fila104' || faltantes[i] == 'fila101') { // GPU o Mobo
                mensaje = 'La configuración seleccionada requiere tarjeta gráfica'; // O placa base, el texto original dice grafica
            }
        }
        if (mensaje != '') {
            alertify.error(mensaje);
        }
    }
}

// Verifica JSONs de arrays para comparaciones estrictas
function recorrer(arrayFaltantes) {
    arrayFaltantes = arrayFaltantes.sort();
    var checkArr = ['fila102', 'fila100', 'fila101']; // RAM, CPU, Mobo
    return JSON.stringify(arrayFaltantes) == JSON.stringify(checkArr);
}

// Verifica si un ID ya existe en la tabla
function checkId(idElemento) {
    let filas = document.querySelectorAll('#lista tr[for="id"]');
    // Filtra filas buscando el ID
    return Array.from(filas).filter(fila => fila.id === idElemento).length === 1;
}

// Actualiza los inputs hidden de categorías (Mobo, Ram, Case, etc.)
function cambiarCategoria(nombreCategoria, idCategoriaPadre) {
    var inputCatMobo = document.getElementById('catMobo');
    var inputCatProce = document.getElementById('catProce');
    var inputCatGpu = document.getElementById('catGpu');

    // Asignaciones basadas en el ID del padre (Categoría principal)
    if (idCategoriaPadre == 100) { // CPU
        inputCatProce.value = nombreCategoria;
    } else if (idCategoriaPadre == 99) { // 0x63 = 99
        inputCatMobo.value = nombreCategoria;
    } else if (idCategoriaPadre == 104 || idCategoriaPadre == 105) { // GPU o Cooler
        inputCatGpu.value = idCategoriaPadre;
    }
}

// Limpia los inputs hidden y estilos cuando se elimina una fila
function eliminarHidden(idCategoriaPadre) {
    // Referencias a todos los inputs hidden de control
    var catMobo = document.getElementById('catMobo');
    var idMobo = document.getElementById('idMobo');
    var idRam = document.getElementById('idRam');
    var idDisco = document.getElementById('idDisco');
    var idFuente = document.getElementById('idFuente');
    var idCase = document.getElementById('idCase');
    var idGpu = document.getElementById('idGpu');

    var voltajecpu = document.getElementById('voltajecpu');
    var socketCool = document.getElementById('socketCool');
    var slotsMobo = document.getElementById('slotsMobo');

    // Referencias a los iconos del acordeón (check/cross)
    var icon100 = document.getElementById('100'); // CPU
    var icon101 = document.getElementById('101'); // Mobo
    var icon102 = document.getElementById('102'); // RAM
    var icon103 = document.getElementById('103'); // Case
    var icon109 = document.getElementById('109'); // Fuente

    // RESET POR CATEGORIA ELIMINADA

    if (idCategoriaPadre == 100) { // CPU Eliminado
        catMobo.value = '';
        idMobo.value = '';
        idRam.value = '';
        idDisco.value = '';
        idFuente.value = '';
        idCase.value = '';
        idGpu.value = '';

        document.getElementById('totalWatts').value = 0;
        voltajecpu.value = 0;
        socketCool.value = 0;

        // Reset visual de iconos (Rojo y fondo rojo claro)
        $('#collapseCPU').collapse('show'); // Abre el acordeón de CPU

        // Resetea estilos de iconos a 'X' roja
        cambiarEstiloIcono(icon100, false);
        cambiarEstiloIcono(document.getElementById('99'), false); // Periferico?
        cambiarEstiloIcono(icon103, false);
        cambiarEstiloIcono(document.getElementById('118'), false); // Disco
        cambiarEstiloIcono(icon102, false);
        cambiarEstiloIcono(document.getElementById('104'), false); // GPU
        cambiarEstiloIcono(document.getElementById('105'), false); // Cooler
        cambiarEstiloIcono(icon109, false);

    } else if (idCategoriaPadre == 99) { // Motherboard o similar (0x63)
        // Reset lógica específica Mobo
        idMobo.value = '';
        idRam.value = '';
        idDisco.value = '';
        idFuente.value = '';
        idCase.value = '';
        idGpu.value = '';

        $('#collapseMobo').collapse('show');

        // Recalcular voltaje restando lo que se quitó
        var totalWatts = document.getElementById('totalWatts');
        var voltajeSocket = document.getElementById('socketCool'); // Usando variable temporal reutilizada
        totalWatts.value = parseFloat(totalWatts.value - voltajeSocket.value);
        voltajeSocket.value = 0;

        // Reset iconos
        cambiarEstiloIcono(document.getElementById('99'), false);
        cambiarEstiloIcono(icon103, false);
        cambiarEstiloIcono(document.getElementById('118'), false);
        cambiarEstiloIcono(icon102, false);
        cambiarEstiloIcono(document.getElementById('104'), false);
        cambiarEstiloIcono(document.getElementById('105'), false);
        cambiarEstiloIcono(icon109, false);

    } else if (idCategoriaPadre == 103) { // Case
        idRam.value = '';
        // Lógica para remover filas asociadas (ej. ventiladores extra)
        var listaCoolers = buscarCooler();
        $('table tbody tr').remove('#' + listaCoolers[0]); // Remueve primer cooler encontrado

        cambiarEstiloIcono(document.getElementById('105'), false); // Resetea icono cooler
        cambiarEstiloIcono(document.getElementById('104'), false); // Resetea icono GPU

    } else if (idCategoriaPadre == 101) { // Mobo
        idDisco.value = '';
    } else if (idCategoriaPadre == 102) { // RAM
        idFuente.value = '';
        idCase.value = '';
    }
    // ... más condiciones para otros IDs (109, 118, etc.)
}

// Función auxiliar para cambiar estilos de iconos (creada para limpiar el código repetitivo de eliminarHidden)
function cambiarEstiloIcono(elemento, esValido) {
    if (!elemento) return;
    var padre = elemento.parentNode.parentNode; // Header del card

    if (esValido) {
        $(elemento).removeClass('fas fa-times').addClass('fas fa-check');
        elemento.style.color = 'green';
        padre.style.background = '#BCFFD6';
    } else {
        $(elemento).removeClass('fas fa-check').addClass('fas fa-times');
        elemento.style.color = 'red';
        padre.style.background = '#FFD3D3';
    }
}

// Remueve la clase 'check' verde y pone la 'X' roja o exclamación cuando se elimina un ítem
function elimClase(idCategoriaPadre) {
    // Iconos
    var i100 = document.getElementById('100');
    var i99 = document.getElementById('99');
    var i118 = document.getElementById('118');
    var i101 = document.getElementById('101');
    var i104 = document.getElementById('104'); // GPU
    var i105 = document.getElementById('105'); // Cooler
    // ... otros iconos

    var filasTabla = document.getElementById('lista').rows;
    var categoriaEnTabla = 'fila' + idCategoriaPadre;
    var sigueEnTabla = false;

    // Verifica si aun quedan productos de esa categoría en la tabla (para categorías múltiples como Discos)
    for (var i = 0; i < filasTabla.length; i++) {
        if (filasTabla[i].id.split('-')[0] == categoriaEnTabla) {
            sigueEnTabla = true;
        }
    }

    // Si ya no queda ninguno de esa categoría, resetea el icono del acordeón
    if (idCategoriaPadre == i100.id && !sigueEnTabla) {
        cambiarEstiloIcono(i100, false);
    } else if (idCategoriaPadre == i99.id && !sigueEnTabla) {
        cambiarEstiloIcono(i99, false);
    }
    // ... Repite para i118, i101, etc.
    // Para GPU (104) y Cooler (105) maneja lógica de exclamación vs X roja
}

// Cambia la clase visual del acordeón a VERDE (Check) cuando se agrega un producto
function cambiarClase(idCategoriaPadre) {
    var icono = document.getElementById(idCategoriaPadre); // Busca por ID (ej '100')
    if (icono) {
        // Lógica especial para 104 (GPU) y 105 (Cooler) que pueden ser opcionales
        if (idCategoriaPadre == 104 || idCategoriaPadre == 105) {
            // Si estaba en exclamación, lo pasa a check verde
            // Si ya estaba check, lo mantiene
        }

        // Lógica general
        $(icono).removeClass('fas fa-times').removeClass('fas fa-exclamation').addClass('fas fa-check');
        icono.style.color = 'green';

        // Cambia fondo del header
        var headerCard = $(icono).closest('.card-header');
        headerCard.css('background', '#BCFFD6'); // Fondo verde claro
    }
}

// Asigna valores a los inputs hidden de IDs (idMobo, idCase, etc.)
function pasarId(idProducto, idCategoriaPadre, slots) {
    var inputIdMobo = document.getElementById('idMobo');
    var inputIdCase = document.getElementById('idCase');
    var inputIdRam = document.getElementById('idRam');
    var inputIdDisco = document.getElementById('idDisco');
    var inputIdFuente = document.getElementById('idFuente');
    var inputSlots = document.getElementById('slotsMobo');

    if (idCategoriaPadre == 99) { // 0x63
        inputIdMobo.value = idProducto;
        inputSlots.value = slots;
    } else if (idCategoriaPadre == 103) { // 0x67 Case
        inputIdCase.value = idProducto;
    } else if (idCategoriaPadre == 101) { // 0x65 Ram (según lógica previa era Mobo, aquí parece invertido en el original o es RAM)
        inputIdRam.value = idProducto;
    } else if (idCategoriaPadre == 102) { // 0x66
        inputIdDisco.value = idProducto;
    } else if (idCategoriaPadre == 109) { // 0x6d Fuente
        inputIdFuente.value = idProducto;
    }
}

// Suma el voltaje al total
function calcularVoltaje(voltajeItem) {
    var inputVoltajeTotal = document.getElementById('voltaje');
    var total = parseFloat(inputVoltajeTotal.value);
    var nuevoTotal = total + parseFloat(voltajeItem);
    inputVoltajeTotal.value = nuevoTotal;
}

// Establece el socket del cooler
function socket(socketType) {
    var inputSocket = document.getElementById('socketCool');
    inputSocket.value = socketType;
}

// *** FUNCIÓN PRINCIPAL PARA AGREGAR PRODUCTOS A LA TABLA ***
function agregarTabla(nombreProducto, precioNormal, precioEfectivo, cantidad, idProducto, idCategoria, idCategoriaPadre, nombreCategoria, flag, voltaje, cooler, gpu, socketVal) {

    var subtotal = parseFloat(precioEfectivo * cantidad / cantidad); // Redundante pero estaba en el original

    // Verifica compatibilidades antes de agregar
    if (!buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precioEfectivo, nombreProducto)) {

        cerrarMenu(idCategoriaPadre);

        var cantidadReal = 0;
        // Si es RAM (101 en este contexto del if) y cantidad > 1
        if (idCategoriaPadre == 101 && cantidad > 1) {
            cantidadReal = 1;
        } else {
            cantidadReal = cantidad;
        }

        // Si es CPU (100)
        if (idCategoriaPadre == 100) {
            coolerNecesario(cooler);
            gpuNecesario(gpu);
            if (socketVal > 0) {
                socket(socketVal);
            }
        }

        cambiarCategoria(nombreCategoria, idCategoriaPadre);
        pasarId(idProducto, idCategoriaPadre, flag); // flag suele ser slots o 1
        cambiarClase(idCategoriaPadre);

        // Calculo de Voltaje
        if (voltaje > 0 && (idCategoriaPadre == 100 || idCategoriaPadre == 102)) {
            // Lógica específica de cálculo de voltaje
            var nuevoVoltaje = parseFloat(voltaje * 1.8); // Margen de seguridad
            if (idCategoriaPadre == 102) { // Si es GPU (o similar en este ID)
                nuevoVoltaje = parseFloat(voltaje * 1.1);
            }
            calcularVoltaje(nuevoVoltaje);
            wats();
        }

        // Construcción de la fila HTML
        var htmlFila = '<tr id="fila' + idCategoriaPadre + '-' + idProducto + '">' +
            '<td>' +
            '<input type="hidden" id="voltajeValor" value="' + voltaje + '">' +
            '<input type="hidden" id="idProducto" name="idProducto[]" value="' + idProducto + '">' +
            '<input type="hidden" id="idPadre" name="catePadre[]" value="' + idCategoriaPadre + '">' +
            '<p>' +
            '<input type="hidden" id="nombreProducto" name="nombre[]" value="' + nombreProducto + '">' +
            nombreProducto +
            '</p>' +
            '</td>' +
            '<td align="center">' +
            '<input type="hidden" name="precioEfectivo[]" id="precioEfectivo" value="' + precioEfectivo + '">' +
            '$' + precioEfectivo.toFixed(2) +
            '</td>' +
            '<td align="center">' +
            '<input type="hidden" id="totalDetalle" name="totalDetalle[]" value="' + subtotal + '">' +
            '$' + subtotal.toFixed(2) +
            '</td>' +
            '<td align="center">' +
            '<input type="hidden" id="canti" name="cantidadEnviar[]" value="' + cantidadReal + '">' +
            cantidadReal +
            '<input type="hidden" id="cantidad" name="cantidad[]" value="' + cantidad + '">' +
            '</td>' +
            '<td>' +
            '<button onclick="eliminarFilas(this)" style="background: crimson; border-radius: 5px; color: #fff; cursor: pointer; font-size: 16px; border: solid crimson" type="button" name="remove">&times</button>' +
            '</td>' +
            '</tr>';

        // Verificación final de RAM (recorrerTable)
        if (recorrerTable(cantidad) == false && idCategoriaPadre == 101) {
            alertify.error('Ya has alcanzado los slots máximos de la placa base');
            $('#collapseRam').collapse('hide');
        } else {
            // Inserta la fila en la tabla
            var tbody = document.getElementById('lista').getElementsByTagName('tbody')[0];
            var nuevaFila = tbody.insertRow();
            nuevaFila.innerHTML = htmlFila;
            nuevaFila.id = 'fila' + idCategoriaPadre + '-' + idProducto; // Asigna ID al TR

            alertify.success('Componente añadido');


            totalizarVenta();
            totalizarVentaNormal();

            if (idCategoriaPadre == 101) { // RAM
                sacarCantidades(idCategoriaPadre);
            }
        }
    }
}

// Verifica slots de RAM y duplicados
function recorrerTable(param1, param2, param3) {
    if (param1 == 1) {
        // Lógica para contar RAMs instaladas vs Slots disponibles
        var tabla = document.getElementById('lista');
        var ramsInstaladas = new Array();
        var slotsDisponibles = document.getElementById('slotsMobo').value;

        // Busca filas de RAM
        for (var i = 0; i < tabla.rows.length; i++) {
            if (tabla.rows[i].id.split('-')[0] == 'fila101') { // 101 es RAM aquí
                ramsInstaladas.push(1); // Añade contador
            }
        }

        if (ramsInstaladas.length < slotsDisponibles) {
            return true; // Hay espacio
        } else {
            return false; // Lleno
        }
    } else {
        buscarValorEnFila(param3, param2, param1);
    }
}

function contarFilas() {
    return document.getElementById('lista').rows.length;
}

// Verifica reglas de negocio (Compatibilidad, Duplicados, Orden de inserción)
function buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precio, nombre) {
    var existe = false;
    var selector = '';

    // Selector para buscar si el producto ya existe en la tabla
    if (idCategoriaPadre == 118 || idCategoriaPadre == 119) { // Almacenamiento o Monitor (pueden repetirse nombres pero no exactos)
        selector = 'tr[id^="fila' + idCategoriaPadre + '"] #nombreProducto';
    } else {
        selector = 'tr[id^="fila' + idCategoriaPadre + '"]';
    }

    var elementoExistente = document.querySelector(selector);
    var slotsMobo = document.getElementById('slotsMobo');
    var inputCooler = document.getElementById('cooler'); // Input hidden que dice si CPU necesita cooler

    // Validaciones
    if (elementoExistente == null) {
        existe = false;
        var numFilas = contarFilas();

        // Debe agregar CPU/Mobo primero
        if (numFilas < 3 && (idCategoriaPadre != 100 && idCategoriaPadre != 99)) { // 100=CPU, 99=Mobo
            alertify.error('Antes debes agregar un procesador y una placa base');
            return true; // Retorna true para bloquear la inserción
        }

        // Validación cooler duplicado
        if (inputCooler.value.length > 1 && (idCategoriaPadre == 104 || idCategoriaPadre == 105)) {
            alertify.error('Ya fue agregado un disipador'); // O mensaje similar
            return true;
        }

        return existe;
    } else {
        // Lógica si YA existe un elemento de esa categoría (ej. sumar RAM)
        if (idCategoriaPadre == 101 || idCategoriaPadre == 118 || idCategoriaPadre == 119) {
            // Lógica para sumar cantidades de RAM si es el mismo producto
            // O alertar si es RAM diferente ("Para mayor compatibilidad, deben ser las mismas RAM")

            // ... lógica de actualización de fila existente (suma cantidad y precio) ...

            // Si todo sale bien actualizando:
            totalizarVenta();
            totalizarVentaNormal();
            wats();
            return true; // Retorna true porque YA se manejó (se actualizó), no hay que insertar nueva fila
        } else {
            // Si intenta agregar otro CPU o Case cuando ya hay uno
            existe = true;
            alertify.error('Ya existe un producto de esta categoría.');
            return true;
        }
    }
    return existe;
}

function coolerNecesario(valor) {
    document.getElementById('coolNeed').value = valor;
}

function gpuNecesario(valor) {
    document.getElementById('gpuNeed').value = valor;
}

function buscarCooler() {
    var tabla = document.getElementById('lista');
    var ids = [];
    // Busca filas que sean de coolers o ventiladores
    for (var i = 0; i < tabla.rows.length; i++) {
        if (tabla.rows[i].id.split('-')[0] == 'fila105') { // 105 Cooler
            ids.push(tabla.rows[i].id);
        }
    }
    return ids;
}

function sacarCantidades(idCategoriaPadre) {
    if (idCategoriaPadre == 101) { // RAM
        var inputsCantidad = document.querySelectorAll('#lista tr[id^="fila101"] #canti');
        var inputTotalCantidad = document.querySelector('#totalCantidad');
        var total = 0;
        for (var i = 0; i < inputsCantidad.length; i++) {
            total += parseFloat(inputsCantidad[i].value);
        }
        inputTotalCantidad.value = total;
    }
}

// Suma columna de Total Venta (Efectivo)
function totalizarVenta() {
    var totales = document.querySelectorAll('#totalDetalle');
    var labelTotal = document.querySelector('#totalVenta');
    var inputTotal = document.getElementById('totalVentaEfectivo');
    var suma = 0;

    for (var i = 0; i < totales.length; i++) {
        suma += parseFloat(totales[i].value);
    }
    var totalFormat = suma.toFixed(2);
    labelTotal.textContent = ' ' + totalFormat;
    inputTotal.value = '$ ' + totalFormat;
}

// Suma columna de Total Normal (Tarjeta) usando factor API
function totalizarVentaNormal() {
    var totales = document.querySelectorAll('#totalDetalle'); // Usa el mismo detalle base?
    var labelTotal = document.querySelector('#totalVentaTarjeta');
    var inputTotal = document.getElementById('totalVentaNormal');
    var suma = 0;

    for (var i = 0; i < totales.length; i++) {
        suma += parseFloat(totales[i].value);
    }

    // Llama a función asíncrona externa (asumida en factor_class.php/js)
    obtenerValorFactor('FTJ').then(function (respuesta) {
        let factorTajeta = respuesta.valor;
        var totalTarjeta = (suma / factorTajeta).toFixed(2); // Inverso del factor descuento

        labelTotal.textContent = ' ' + totalTarjeta;
        inputTotal.value = '$ ' + totalTarjeta;

    }).catch(function (error) {
        alert('Ocurrió un error al obtener el factor ' + error);
        console.log('Error: ' + error);
    });
}

// Función onclick del botón "X" en la tabla
function eliminarFilas(boton) {
    var fila = boton.parentNode.parentNode; // TR
    var tabla = document.querySelector('#lista tbody');
    var idPadreInput = document.querySelector('#' + fila.id + ' #idPadre');
    var idCategoriaPadre = idPadreInput.value;

    // Lógica especial si se borra CPU (100) o RAM (102 en este map, cuidado con IDs)
    if (idCategoriaPadre == 100 || idCategoriaPadre == 102) {
        // Reseteo de voltajes y watts
        if (idCategoriaPadre == 100) {
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('coolNeed').value = 0;
            document.getElementById('gpuNeed').value = 0;
            document.getElementById('socketCool').value = 0;
        }
        // Recalcular Watts totales restando
        var totalWatts = document.getElementById('totalWatts');
        var voltajeItem = document.querySelector('#' + fila.id + ' #voltajeValor');
        var nuevoWatts = parseFloat(totalWatts.value) - parseFloat(voltajeItem.value);
        totalWatts.value = nuevoWatts; // .toFixed(2) si es necesario
    }

    tabla.removeChild(fila); // Borra fila del DOM

    elimClase(idCategoriaPadre); // Resetea iconos visuales
    eliminarHidden(idCategoriaPadre); // Limpia inputs hidden

    alertify.error('Componente eliminado');

    totalizarVenta();
    totalizarVentaNormal();
    wats();
    obligatorios();
}