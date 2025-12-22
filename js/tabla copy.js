// La lista de textos ofuscados y el mezclador se eliminan porque no son funcionales.

function aler() {
    Swal.fire({
        'icon': 'success',
        'title': 'Recuerda que...',
        'text': 'El precio final de tu configuración tendrá un BUEN DESCUENTO cuando envíes tu cotización a KPC.'
    });
}

window['onload'] = aler;

function cerrarMenu(id) {
    var collapseID = '';
    // Mapeo exacto de los IDs hexadecimales a decimales (0x63 = 99, 0x64 = 100, etc.)
    if (id == 99) {
        collapseID = 'collapseTwo';
    } else if (id == 100) {
        collapseID = 'collapseOne';
    } else if (id == 103) {
        collapseID = 'collapseThree';
    } else if (id == 101) {
        collapseID = 'collapseFour';
    } else if (id == 102) {
        collapseID = 'collapseFive';
    } else if (id == 109) {
        collapseID = 'collapseSix';
    } else if (id == 118) {
        collapseID = 'collapseSev';
    } else if (id == 104) {
        collapseID = 'collapseEight';
    } else if (id == 105) {
        collapseID = 'collapseNine';
    } else if (id == 110 || id == 111 || id == 155) {
        collapseID = 'collapseThen';
    } else if (id == 119) {
        collapseID = 'collapseElev';
    } else if (id == 122) {
        collapseID = 'collapseTwelve';
    }

    if (id == 101 || id == 118 || id == 110 || id == 111 || id == 119 || id == 155) {
        // No hace nada, tal como en el original
    } else {
        $('#' + collapseID).collapse('hide');
    }
}

function validarTabla() {
    var tabla = document.getElementById('lista');
    var idsEnTabla = new Array();
    var inputCooler = document.getElementById('cooler');
    var inputGpu = document.getElementById('idGpu');

    for (var i = 0; i < tabla.rows.length; i++) {
        // Divide el ID de la fila (ej: fila100-123)
        if (tabla.rows[i].id.split('-')[0] == 'fila104' || tabla.rows[i].id.split('-')[0] == 'fila109') {
            idsEnTabla.push('fila104');
            idsEnTabla.push('fila109');
        }
        idsEnTabla.push(tabla.rows[i].id.split('-')[0]);
    }

    // Filtra comparando con los definidos
    var diferencia = idsEnTabla.filter(function (elemento, indice, array) {
        return definidos.indexOf(elemento) === indice; // Nota: Esta lógica del filtro original parece buscar únicos o diff
    });

    var definidos;
    if (inputGpu.value == 1 && inputCooler.value == 1) {
        definidos = ['fila102', 'fila118', 'fila100', 'fila103', 'fila99', 'fila101', 'fila109', 'fila104', 'fila105', '100'];
    } else if (inputGpu.value == 1 && inputCooler.value == 0) {
        definidos = ['fila102', 'fila100', 'fila100', 'fila101', 'fila99', 'fila101', 'fila109', '100'];
    } else if (inputCooler.value == 1 && inputGpu.value == 0) {
        definidos = ['fila102', 'fila100', 'fila109', 'fila103', 'fila99', 'fila101', 'fila109', 'fila104', 'fila105'];
    } else {
        definidos = ['fila102', 'fila100', 'fila100', 'fila103', 'fila103', 'fila101', 'fila109'];
    }

    if (compare(idsEnTabla, definidos)) {
        $('#modalFinal').modal('show');
    } else {
        alertify.error('¡Hace falta incorporar al menos un componente básico para armar su CPU!.');
    }
}

function wats() {
    var totalWatts = document.getElementsByName('totalWatts'); // Original usaba getElementsByName probablemente
    var voltajeCpu = document.getElementById('voltajecpu');
    totalWatts.value = voltajeCpu.value; // Nota: Si es getElementsByName, esto fallaría en JS estricto sin índice [0], pero así estaba el original
}

function compare(arr1, arr2) {
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    var arrayFaltantes = new Array();
    var coincidencias = 0;
    var flag = false;

    for (var i = 0; i < arr2.length; i++) {
        flag = false;
        var encontrado = false;
        for (var j = 0; j < arr1.length; j++) {
            if (arr1[j] == arr2[i]) {
                flag = true;
                encontrado = true;
                coincidencias++;
            }
        }
        if (encontrado == false) {
            arrayFaltantes.push(arr2[i]);
        }
    }

    if (arrayFaltantes.length >= 1 && arrayFaltantes.length <= 3) {
        difere(arrayFaltantes);
    } else {
        return coincidencias == arr2.length;
    }
}

function difere(faltantes, evento) {
    var mensaje = '';
    if (recorrer(faltantes)) {
        Swal.fire({
            'icon': 'error',
            'title': 'Revisa tu configuración',
            'text': 'Por favor, agrega GPU y Cooler a tu configuración, ya que seleccionaste un procesador que lo requiere.'
        });
    } else {
        for (var i = 0; i < faltantes.length; i++) {
            if (faltantes[i] == '100') {
                mensaje = 'La configuración seleccionada requiere cooler';
            } else if (faltantes[i] == 'fila104' || faltantes[i] == 'fila109') { // 109 era el string en hex original para tarjeta grafica a veces
                mensaje = 'La configuración seleccionada requiere tarjeta gráfica';
            }
        }
        if (mensaje != '') {
            alertify['error'](mensaje);
            evento.preventDefault();
        }
    }
}

function recorrer(arr) {
    arr = arr.sort();
    var comparacion = ['fila102', 'fila104', 'fila109'];
    var jsonArr = JSON.stringify(arr);
    var jsonComp = JSON.stringify(comparacion);
    return JSON.stringify(arr) == JSON.stringify(comparacion);
}

function checkId(id) {
    let filas = document.querySelectorAll('#lista tr[for="id"]');
    return [].filter.call(filas, row => row.id === id).length === 1;
}

function cambiarCategoria(valor, id) {
    var catMobo = document.getElementsByName('catMobo'); // Probablemente getElementsByName en original por el contexto
    var catProce = document.getElementsByName('catProce');
    var catRam = document.getElementsByName('catRam');
    var catGpu = document.getElementsByName('catGpu'); // Original usaba getElementById a veces, aqui mantenemos logica
    var catFuente = document.getElementsByName('catFuente');
    var catDisco = document.getElementsByName('catDisco');
    var catCase = document.getElementsByName('catCase');
    var catCooler = document.getElementById('catGpu'); // ID 102 en el original a veces apunta a catGpu

    if (id == 100) {
        catMobo.value = valor;
    } else if (id == 99) {
        catProce.value = valor;
    } else if (id == 104 || id == 105) {
        catCooler.value = id;
    }
}

function eliminarHidden(id) {
    var catMobo = document.getElementById('catMobo'); // Nota: el original usa getElementById aqui
    var catProce = document.getElementById('catProce');
    var catRam = document.getElementById('catRam');
    var catGpu = document.getElementById('catGpu');
    var catFuente = document.getElementById('catFuente');
    var catDisco = document.getElementById('catDisco'); // ID 103 en original
    var catCase = document.getElementById('catCase'); // ID 109
    
    var idGpuInput = document.getElementById('idGpu');
    var totalWatts = document.getElementById('voltajecpu');
    var voltajeGpu = document.getElementById('voltajegpu'); 
    var coolerInput = document.getElementById('cooler');
    var idRamInput = document.getElementById('idRam');
    var idMoboInput = document.getElementById('idMobo'); // ID 100
    var socketCool = document.getElementById('socketCool');
    
    // Variables DOM de iconos/titulos (usadas para cambiar colores)
    var tituloProce = document.getElementById('99');
    var tituloCooler = document.getElementById('103');
    var tituloRam = document.getElementById('101');
    var tituloGpu = document.getElementById('102');
    var tituloFuente = document.getElementById('118');
    var tituloMobo = document.getElementById('100'); // ID 100
    var tituloCase = document.getElementById('109');
    var tituloDisco = document.getElementById('104');
    var tituloExtra = document.getElementById('105');
    var tituloMonitor = document.getElementById('110');
    var tituloPeriferico = document.getElementById('119');

    if (id == 100) { // Motherboard
        catMobo.value = '';
        catProce.value = '';
        catRam.value = '';
        catGpu.value = '';
        catFuente.value = '';
        catDisco.value = '';
        catCase.value = '';
        
        totalWatts.value = 0;
        voltajeGpu.value = 0;
        coolerInput.value = 0;
        idRamInput.value = 0;
        socketCool.value = 0;
        idGpuInput.value = 0;

        $('#collapseOne').collapse('show');
        
        $(tituloMobo).removeClass('fas fa-check').addClass('fas fa-times');
        tituloMobo.style.color = 'red';
        var padre = tituloMobo.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloProce).removeClass('fas fa-check').addClass('fas fa-times');
        tituloProce.style.color = 'red';
        var padre = tituloProce.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloCooler).removeClass('fas fa-check').addClass('fas fa-times');
        tituloCooler.style.color = 'red';
        var padre = tituloCooler.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloRam).removeClass('fas fa-check').addClass('fas fa-times');
        tituloRam.style.color = 'red';
        var padre = tituloRam.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloGpu).removeClass('fas fa-check').addClass('fas fa-times');
        tituloGpu.style.color = 'red';
        var padre = tituloGpu.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloFuente).removeClass('fas fa-check').addClass('fas fa-times');
        tituloFuente.style.color = 'red';
        var padre = tituloFuente.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloMobo).removeClass('fas fa-check').addClass('fas fa-times');
        tituloMobo.style.color = 'red';
        var padre = tituloMobo.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloCase).removeClass('fas fa-check').addClass('fas fa-times');
        tituloCase.style.color = 'red';
        var padre = tituloCase.parentNode.parentNode.parentNode;
        padre.style['background'] = '#FFD3D3';

        $(tituloDisco).removeClass('fas fa-check').addClass('fas fa-times');
        tituloDisco.style.background = '#FFD3D3'; // Nota: el original a veces aplicaba estilo directo
        
        voltajeGpu.value = 0;
        idGpuInput.value = 0;

    } else if (id == 99) { // Procesador
        catProce.value = '';
        catRam.value = '';
        catGpu.value = '';
        catFuente.value = '';
        catDisco.value = '';
        catCase.value = '';
        
        $('#collapseTwo').collapse('show');
        
        totalWatts.value = parseFloat(totalWatts.value - voltajeGpu.value);
        voltajeGpu.value = 0;

        $(tituloProce).removeClass('fas fa-check').addClass('fas fa-times');
        tituloProce.style.color = 'red';
        var padre = tituloProce.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloCooler).removeClass('fas fa-check').addClass('fas fa-times');
        tituloCooler.style.color = 'red';
        var padre = tituloCooler.parentNode.parentNode.parentNode; // Nota: original usaba parentNode múltiple
        padre.style.background = '#FFD3D3';

        $(tituloRam).removeClass('fas fa-check').addClass('fas fa-times');
        tituloRam.style.color = 'red';
        var padre = tituloRam.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloGpu).removeClass('fas fa-check').addClass('fas fa-times');
        tituloGpu.style.color = 'red';
        var padre = tituloGpu.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloFuente).removeClass('fas fa-check').addClass('fas fa-times');
        tituloFuente.style.color = 'red'; // Nota: En el original a veces usaba removeClass('fas fa-check').addClass('fas fa-times')
        var padre = tituloFuente.parentNode.parentNode.parentNode; // Asumiendo estructura DOM
        padre.style.background = '#FFD3D3';

        $(tituloMobo).removeClass('fas fa-check').addClass('fas fa-times');
        tituloMobo.style.color = 'red';
        var padre = tituloMobo.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3'; // El original tenía errores lógicos de reseteo aquí, los mantengo fiel.

        $(tituloCase).removeClass('fas fa-check').addClass('fas fa-times');
        tituloCase.style.color = 'red';
        var padre = tituloCase.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

        $(tituloDisco).removeClass('fas fa-check').addClass('fas fa-times');
        tituloDisco.style.color = 'red';
        var padre = tituloDisco.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';
        
        voltajeGpu.value = 0;
        idGpuInput.value = 0;

    } else if (id == 103) { // Cooler
        catRam.value = '';
        coolerInput.value = '';
        var arrayCooler = buscarCooler();
        $('table tbody tr ').remove('#' + arrayCooler[0]);
        
        $(tituloCase).removeClass('fas fa-check').addClass('fas fa-times');
        tituloCase.style.color = 'red';
        var padre = tituloCase.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';
        
        $(tituloDisco)[0].className = 'fas fa-times'; // Manipulación directa en original
        tituloDisco.style.color = 'red';
        var padre = tituloDisco.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';

    } else if (id == 101) { // RAM
        catGpu.value = '';
    } else if (id == 102) { // GPU
        catFuente.value = '';
        catDisco.value = '';
    } else if (id == 109) { // Case
        catDisco.value = '';
    } else if (id == 118) { // Fuente
        catCase.value = '';
    } else if (id == 104 || id == 105) { // Disco
        coolerInput.value = '';
    }
}

function obligatorios() {
    var idGpu = document.getElementById('idGpu');
    var cooler = document.getElementById('cooler');
    var tituloCooler = document.getElementById('tituloCooler'); // Asumiendo ID por el contexto de 0x56
    var tituloGpu = document.getElementById('tituloGpu'); // ID 0x45
    var tituloFuente = document.getElementById('tituloFuente'); // ID 0x44
    
    // El original compara valores de strings '1' y '0'
    if (idGpu.value == 1 && cooler.value == 1) {
        if (tituloCooler.className != 'fas fa-check') {
            $(tituloCooler).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloCooler.style.color = 'red';
            
            $(tituloGpu).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloGpu.style.color = 'red';

            $(tituloFuente).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloFuente.style.color = 'red';
        }
    } else if (idGpu.value == 0 && cooler.value == 1) {
        if (tituloGpu.className != 'fas fa-check' && tituloFuente.className != 'fas fa-check') {
            $(tituloGpu).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloGpu.style.color = 'red';
            
            $(tituloFuente).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloFuente.style.color = 'red';
            
            $(tituloCooler).removeClass('fas fa-check').addClass('fas fa-times');
            tituloCooler.style.color = 'green'; // Inconsistencia original, mantenida
        }
    } else if (idGpu.value == 1 && cooler.value == 0) {
        $(tituloCooler).removeClass('fas fa-times').addClass('fas fa-times');
        tituloCooler.style.color = 'red';
        
        $(tituloGpu).removeClass('fas fa-exclamation').addClass('fas fa-times');
        tituloGpu.style.color = 'green';
        
        $(tituloFuente).removeClass('fas fa-exclamation').addClass('fas fa-times');
        tituloFuente.style.color = 'green';
    } else {
        if (tituloGpu.className != 'fas fa-check' && tituloFuente.className != 'fas fa-check') {
            $(tituloGpu).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloGpu.style.color = 'green';
            $(tituloFuente).removeClass('fas fa-times').addClass('fas fa-times');
            tituloFuente.style.color = 'green';
        }
        if (tituloCooler.className != 'fas fa-check') {
            $(tituloCooler).removeClass('fas fa-times').addClass('fas fa-exclamation');
            tituloCooler.style.color = 'green';
        }
    }
}

function elimClase(id) {
    var tituloMobo = document.getElementById('100');
    var tituloProce = document.getElementById('99');
    var tituloRam = document.getElementById('101');
    var tituloRam2 = document.getElementById('101'); // Original duplica busquedas a veces
    var tituloCooler = document.getElementById('103'); // Contexto de 0x56
    var tituloGpu = document.getElementById('102');
    var tituloFuente = document.getElementById('118');
    var tituloDisco = document.getElementById('104');
    var tituloGpuInput = document.getElementById('tituloGpu'); // 0x45
    var tituloFuenteInput = document.getElementById('tituloFuente'); // 0x46
    var tituloCase = document.getElementById('109');
    var tituloExtra = document.getElementById('105');
    var tabla = document.getElementById('lista');
    
    var idBusqueda = 'fila' + id;
    var encontrado = false;
    for (var i = 0; i < tabla.rows.length; i++) {
        if (tabla.rows[i].id.split('-')[0] == idBusqueda) {
            encontrado = true;
        }
    }

    if (id == tituloMobo.id && encontrado == false) {
        $(tituloMobo).removeClass('fas fa-check').addClass('fas fa-times');
        tituloMobo.style.color = 'red';
        var padre = tituloMobo.parentNode.parentNode;
        padre.style.background = '#FFD3D3';
    } else if (id == tituloProce.id && encontrado == false) {
        $(tituloProce).removeClass('fas fa-check').addClass('fas fa-times');
        tituloProce.style.color = 'red';
        var padre = tituloProce.parentNode.parentNode;
        padre.style.background = '#FFD3D3';
    } else if (id == tituloRam.id && encontrado == false) {
        $(tituloRam).removeClass('fas fa-check').addClass('fas fa-times');
        tituloRam.style.color = 'red';
        var padre = tituloRam.parentNode.parentNode.parentNode; // Ram suele tener mas anidamiento
        padre.style.background = '#FFD3D3';
    } else if (id == tituloRam2.id && encontrado == false) { // Logica duplicada en original
        $(tituloRam2).removeClass('fas fa-check').addClass('fas fa-times');
        tituloRam2.style.color = 'red';
        var padre = tituloRam2.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';
    } else if (id == tituloCooler.id && encontrado == false) {
        var idGpuVal = document.getElementById('idGpu');
        if (idGpuVal.value == 1) {
            $(tituloCooler).removeClass('fas fa-check').addClass('fas fa-times');
            tituloCooler.style.color = 'red';
            var padre = tituloCooler.parentNode.parentNode.parentNode;
            padre.style.background = '#FFD3D3';
        } else {
            $(tituloCooler).removeClass('fas fa-check').addClass('fas fa-exclamation');
            tituloCooler.style.color = '#ff7b11';
            var padre = tituloCooler.parentNode.parentNode;
            padre.style.background = '#FEFFC5';
        }
    } else if (id == tituloGpu.id && encontrado == false) {
        $(tituloGpu).removeClass('fas fa-check').addClass('fas fa-times');
        tituloGpu.style.color = 'red';
        var padre = tituloGpu.parentNode.parentNode.parentNode; // Correccion de estructura
        padre.style.background = '#FFD3D3';
    } else if (id == tituloCase.id && encontrado == false) {
        $(tituloCase).removeClass('fas fa-check').addClass('fas fa-times');
        tituloCase.style.color = '#ff7b11';
        var padre = tituloCase.parentNode.parentNode.parentNode;
        padre.style.background = '#FEFFC5';
    } else if (id == tituloFuente.id && encontrado == false) {
        $(tituloFuente).removeClass('fas fa-check').addClass('fas fa-times');
        tituloFuente.style.color = 'red';
        var padre = tituloFuente.parentNode.parentNode.parentNode;
        padre.style.background = '#FFD3D3';
    } else if ((id == tituloDisco.id && encontrado == false) || (id == tituloGpuInput.id && encontrado == false)) {
        var coolerVal = document.getElementById('cooler');
        if (coolerVal.value == 1) {
            $(tituloDisco).removeClass('fas fa-check').addClass('fas fa-times');
            tituloDisco.style.color = 'red';
            var padre = tituloDisco.parentNode.parentNode.parentNode;
            padre.style.background = '#FFD3D3';
            
            $(tituloGpuInput).removeClass('fas fa-check').addClass('fas fa-times');
            tituloGpuInput.style.color = 'red';
            var padre = tituloGpuInput.parentNode.parentNode;
            padre.style.background = '#FFD3D3';
        } else {
            $(tituloDisco).removeClass('fas fa-check').addClass('fas fa-exclamation');
            tituloDisco.style.color = '#ff7b11'; // Verde anaranjado en original
            var padre = tituloDisco.parentNode.parentNode.parentNode;
            padre.style.background = '#FFD3D3'; // Logica confusa en original

            $(tituloGpuInput).removeClass('fas fa-check').addClass('fas fa-exclamation');
            tituloGpuInput.style.color = '#ff7b11';
            var padre = tituloGpuInput.parentNode.parentNode;
            padre.style.background = '#FEFFC5';
        }
    } else if (id == tituloExtra.id && encontrado == false) {
         $(tituloExtra).removeClass('fas fa-check').addClass('fas fa-times');
         tituloExtra.style.color = '#ff7b11';
         var padre = tituloExtra.parentNode.parentNode;
         padre.style.background = '#FEFFC5'; // Mismo color de alerta
    }
}

function cambiarClase(id) {
    var tituloProce = document.getElementById('99');
    var tituloMobo = document.getElementById('100'); // 100 no estaba en el array original de la funcion pero se infiere
    var tituloRam = document.getElementById('101');
    var tituloGpu = document.getElementById('102'); // ID 102
    var tituloCooler = document.getElementById('103');
    var tituloDisco = document.getElementById('104');
    var tituloFuente = document.getElementById('118');
    var tituloCase = document.getElementById('109');
    var tituloExtra = document.getElementById('105');
    var tituloMonitor = document.getElementById('110');
    var tituloPeri = document.getElementById('119');
    var tituloSilla = document.getElementById('122');

    if (id == tituloProce.id) {
        $(tituloProce).removeClass('fas fa-times').addClass('fas fa-check');
        tituloProce.style.color = 'green';
        var padre = tituloProce.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloMobo.id) { // Inferencia de 99
        $(tituloMobo).removeClass('fas fa-times').addClass('fas fa-check');
        tituloMobo.style.color = 'green';
        var padre = tituloMobo.parentNode.parentNode.parentNode; // Asumiendo estructura
        padre.style.background = '#BCFFD6';
    } else if (id == tituloRam.id) {
        $(tituloRam).removeClass('fas fa-times').addClass('fas fa-check');
        tituloRam.style.color = 'green';
        var padre = tituloRam.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloCooler.id) {
        $(tituloCooler).removeClass('fas fa-times').addClass('fas fa-check');
        tituloCooler.style.color = 'green';
        var padre = tituloCooler.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloGpu.id) {
        var claseActual = '';
        if (tituloGpu.className == 'fa-times fas') claseActual = 'fas fa-times';
        else if (tituloGpu.className == 'fa-exclamation fas') claseActual = 'fa-exclamation fas';
        
        $(tituloGpu).removeClass(claseActual).addClass('fas fa-check');
        tituloGpu.style.color = 'green';
        var padre = tituloGpu.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloDisco.id) {
        $(tituloDisco).removeClass('fas fa-times').addClass('fas fa-check');
        tituloDisco.style.color = 'green';
        var padre = tituloDisco.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloFuente.id) {
        $(tituloFuente).removeClass('fas fa-times').addClass('fas fa-check');
        tituloFuente.style.color = 'green';
        var padre = tituloFuente.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloCase.id || id == tituloExtra.id) {
        var claseActual = '';
        if (tituloCase.className == 'fas fa-times' || tituloExtra.className == 'fas fa-times') claseActual = 'fas fa-times';
        else if (tituloCase.className == 'fas fa-exclamation' || tituloExtra.className == 'fas fa-exclamation') claseActual = 'fas fa-exclamation';
        
        $(tituloCase).removeClass(claseActual).addClass('fas fa-check');
        tituloCase.style.color = 'green';
        var padre = tituloCase.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
        
        $(tituloExtra).removeClass(claseActual).addClass('fas fa-check');
        tituloExtra.style.color = 'green';
        var padre = tituloExtra.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == 110 || id == 111 || id == 155) { // Monitor
        $(tituloMonitor).removeClass('fas fa-times').addClass('fas fa-check');
        tituloMonitor.style.color = 'green';
        var padre = tituloMonitor.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloPeri.id) {
        $(tituloPeri).removeClass('fas fa-exclamation').addClass('fas fa-check');
        tituloPeri.style.color = 'green';
        var padre = tituloPeri.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    } else if (id == tituloSilla.id) {
        $(tituloSilla).removeClass('fas fa-times').addClass('fas fa-check');
        tituloSilla.style.color = 'green';
        var padre = tituloSilla.parentNode.parentNode.parentNode;
        padre.style.background = '#BCFFD6';
    }
}

function pasarId(idProducto, idCategoria, watts) {
    var idMobo = document.getElementById('idMobo');
    var idCase = document.getElementById('idCase');
    var idRam = document.getElementById('idRam');
    var idGpu = document.getElementById('idGpu'); // Original 0x3b
    var idFuente = document.getElementById('idFuente');
    var voltajegpu = document.getElementById('voltajegpu'); // 0x3d
    var idDisco = document.getElementById('idDisco'); // 0x61
    var idCooler = document.getElementById('cooler'); // 0x37

    if (idCategoria == 99) { // CPU
        idMobo.value = idProducto;
        idDisco.value = watts; // Nota: en original usa idDisco como temporal de watts a veces
    } else if (idCategoria == 103) { // Cooler
        idCase.value = idProducto;
    } else if (idCategoria == 101) { // RAM
        idRam.value = idProducto;
    } else if (idCategoria == 102) { // GPU
        idGpu.value = idProducto;
    } else if (idCategoria == 109) { // Case
        idFuente.value = idProducto;
    } else if (idCategoria == 118) { // Fuente
        voltajegpu.value = idProducto;
    }
}

function calcularVoltaje(watts) {
    var voltajecpu = document.getElementById('voltajecpu');
    var valorActual = parseFloat(voltajecpu.value);
    var suma = parseFloat(valorActual) + parseFloat(watts);
    voltajecpu.value = suma;
}

function socket(valor) {
    var socketCool = document.getElementById('socketCool');
    socketCool.value = valor;
}

function agregarTabla(nombre, precio, id, cantidad, idProducto, idPadre, idCategoria, precioEfectivo, watts, voltaje, reqCooler, reqGpu, socketCpu) {
    var subtotal = parseFloat(idProducto * cantidad / cantidad); // Formula original extraña
    if (!buscarValorEnFila(idPadre, id, cantidad, idProducto, nombre)) {
        cerrarMenu(idPadre);
        var cantidadReal = 0;
        if (idPadre == 101 && cantidad > 1) {
            cantidadReal = 1;
        } else {
            cantidadReal = cantidad;
        }
        
        if (idPadre == 100) { // Motherboard o CPU segun contexto original (a veces 0x64 es 100)
            coolerNecesario(reqCooler);
            gpuNecesario(reqGpu);
            if (socketCpu > 0) {
                socket(socketCpu);
            }
        }
        
        cambiarCategoria(precioEfectivo, idPadre);
        pasarId(id, idPadre, watts);
        cambiarClase(idPadre);

        if (voltaje > 0 && (idPadre == 100 || idPadre == 102)) {
            if (idPadre == 100) {
                document.getElementById('voltajecpu').value = voltaje;
            } else if (idPadre == 102) {
                document.getElementById('voltajegpu').value = voltaje;
            }
            
            var voltajeNuevo = parseFloat(voltaje * 1.8);
            if (idPadre == 102) {
                voltajeNuevo = parseFloat(voltaje * 1.1); // GPU
            }

            calcularVoltaje(voltajeNuevo);
            wats();
        }

        var filaHTML = '<td style="display:none"></td>' +
             '<td><input type="hidden" id="voltajeValor" value="' + voltaje + '">' +
             '<input type="hidden" id="idProducto" name="idProducto[]" value="' + id + '">' +
             '<input type="hidden" id="idPadre" name="catePadre[]" value="' + idPadre + '"><p>' + nombre + '</p></td>' +
             '<td align="center"><input type="hidden" name="precioEfectivo[]" id="precioEfectivo" value="' + precioEfectivo + '">$' + precioEfectivo + '</td>' +
             '<td align="center">' +
             '<input type="hidden" id="canti' + idPadre + '" name="cantidadEnviar[]" value="' + cantidadReal + '">' +
             '<input type="hidden" id="cantidad' + idPadre + '" name="cantidad[]" value="' + cantidad + '">' + cantidadReal + '</td>' +
             '<td><button onclick="eliminarFilas(this)" style="background: crimson; border-radius: 5px; color: #fff; cursor: pointer; font-size: 16px; border: solid crimson" type="button" name="remove">&times</button></td>';

        if (recorrerTable(cantidad) == false && idPadre == 101) {
            alertify.error('El kit de memorias es mayor a los slots de la placa base');
            $('#collapseFour').collapse('hide');
        } else {
            var tr = document.createElement('tr');
            tr.innerHTML = filaHTML;
            document.querySelector('table tbody').appendChild(tr);
            tr.id = 'fila' + idPadre + '-' + id;
            
            alertify.success('Componente añadido');
            
            if (idPadre == 102 || idPadre == 105 || idPadre == 104) {
                // nada
            } else {
                obligatorios();
            }
            totalizarVenta();
            totalizarVentaNormal();
            if (idPadre == 101) {
                sacarCantidades(idPadre);
            }
        }
    }
}

function recorrerTable(cantidad, idFila, idCat) {
    if (cantidad == 1) {
        var tabla = document.getElementById('lista'); // 0xf
        var arrayTem = new Array();
        var slots = document.getElementById('idDisco'); // 0x61 usado como slots a veces
        for (var i = 0; i < tabla.rows.length; i++) {
            if (tabla.rows[i].id.split('-')[0] == 'fila101') { // 0x1d es 29, fila29? contexto dice RAM
                var val = document.querySelector('tr#' + tabla.rows[i].id + ' #idProducto');
                arrayTem.push(val.value);
            }
        }
        if (arrayTem.length < slots.value) {
            return true;
        } else {
            return false;
        }
    } else {
        buscarValorEnFila(idCat, idFila, cantidad);
    }
}

function contarFilas() {
    var tabla = document.getElementById('lista');
    var filas = tabla.rows.length;
    return filas;
}

function buscarValorEnFila(idPadre, idProducto, cantidad, precio, nombre) {
    var existe = false;
    if (idPadre == 118 || idPadre == 119) {
        var el = document.querySelector('table tbody tr[id^="fila' + nombre + '"]#nombreProducto'); // Selector complejo original
    } else {
        var el = document.querySelector('table tbody tr[id^="fila' + idPadre + '"]');
    }
    
    var productoInput = document.querySelector('table tbody tr[id^="fila' + idProducto + '"]#idProducto');
    var slotsMobo = document.getElementById('idDisco'); // 0x61
    var cooler = document.getElementById('cooler'); // cooler
    
    if (el == null) {
        existe = false;
        var filas = contarFilas();
        if (filas < 3 && (idPadre != 100 && idPadre != 99)) {
            alertify.error('Antes debes agregar un procesador y una placa base');
            return true;
        }
        if (cooler.value.length > 1 && (idPadre == 104 || idPadre == 105)) {
            alertify.error('Ya fue agregado un disipador');
            return true;
        }
        if (slotsMobo.value < cantidad && idPadre == 101) {
            alertify.error('Para mayor compatibilidad, deben ser las mismas RAM');
            return true;
        }
        return existe;
    } else {
        if (idPadre == 101 || idPadre == 118 || idPadre == 119) {
            if (productoInput == null && idPadre == 101) {
                alertify.error('No quedan slots disponibles en la placa base.');
                return true;
            } else {
                if (slotsMobo.value < cantidad && idPadre == 101) {
                    alertify['error']('Para mayor compatibilidad, deben ser las mismas RAM');
                    return true;
                }
                var trPadre = el.parentNode.parentNode; // Ajuste de estructura
                var cantInput = trPadre.querySelector('#canti' + idPadre);
                var cantRealInput = trPadre.querySelector('#cantidad' + idPadre); // 0x83
                
                var precioHTML = trPadre.parentNode;
                var totalDetalle = trPadre.querySelector('#totalDetalle'); // 0x84
                var tdTotal = totalDetalle.parentNode;
                
                var cantidadActual = cantInput.value;
                if (parseInt(slotsMobo.value) <= parseInt(cantInput.value) && idPadre == 101) {
                     alertify.error('Ya has alcanzado los slots máximos de la placa base');
                     $('#collapseFour').collapse('hide');
                     return true;
                } else {
                     cantInput.value = parseInt(cantInput.value) + parseInt(cantidad);
                     var nuevaCant = parseInt((parseInt(cantidadActual) + parseInt(cantidad)) / cantidad);
                     cantRealInput.value = nuevaCant;
                     
                     // Actualizacion de precios
                     var valorTotalAnt = totalDetalle.value;
                     totalDetalle.value = (parseFloat(totalDetalle.value) + parseFloat(precio)).toFixed(2);
                     tdTotal.innerHTML = '$' + (parseFloat(valorTotalAnt) + parseFloat(precio)).toFixed(2);
                     tdTotal.appendChild(totalDetalle);
                     
                     alertify.success('Componente sumado');
                     totalizarVenta();
                     totalizarVentaNormal();
                     wats();
                     return true;
                }
            }
        } else {
            existe = true;
            alertify.error('Ya existe un producto de esta categoría.');
        }
    }
    return existe;
}

function coolerNecesario(valor) {
    var el = document.getElementById('cooler');
    el.value = valor;
}

function gpuNecesario(valor) {
    var el = document.getElementById('idGpu');
    el.value = valor;
}

function buscarCooler() {
    var tabla = document.getElementById('lista');
    var arr = new Array();
    for (var i = 0; i < tabla.rows.length; i++) {
        if (tabla.rows[i].id.split('-')[0] == 'fila104' || tabla.rows[i].id.split('-')[0] == 'fila109') {
            arr.push(tabla.rows[i].id);
        }
    }
    return arr;
}

function sacarCantidades(id) {
    if (id == 101) {
        var lista = document.querySelectorAll('#cantidad101');
        var total = document.querySelector('#totalCantidad');
        var suma = 0;
        for (var i = 0; i < lista.length; i++) {
            suma += parseFloat(lista[i].value);
        }
        total.value = suma;
    }
}

function totalizarVenta() {
    var lista = document.querySelectorAll('#precioEfectivo');
    var texto = document.querySelector('#totalVenta');
    var input = document.getElementById('totalVentaEfectivo');
    var suma = 0;
    for (var i = 0; i < lista.length; i++) {
        suma += parseFloat(lista[i].value);
    }
    var fixed = suma.toFixed(2);
    texto.textContent = ' ' + fixed;
    input.value = '$ ' + fixed;
}

function totalizarVentaNormal() {
    var lista = document.querySelectorAll('#totalDetalle');
    var texto = document.querySelector('#totalVentaTarjeta');
    var input = document.getElementById('totalVentaNormal');
    var suma = 0;
    for (var i = 0; i < lista.length; i++) {
        suma += parseFloat(lista[i].value);
    }
    
    // Llamada externa presumiblemente existente en tu sistema
    obtenerValorFactor('FTJ').then(function (respuesta) {
        let factorTajeta = respuesta.valor;
        var val = (suma / factorTajeta).toFixed(2);
        texto.innerHTML = ' ' + val;
        input.value = '$ ' + val;
    }).catch(function (error) {
        alert('Ocurrió un error al obtener el factor ' + error);
        console.log('Error: ' + error);
    });
}

function eliminarFilas(btn) {
    var tr = btn.parentNode.parentNode;
    var tbody = document.querySelector('table tbody');
    var idPadre = document.querySelector('tr#' + tr.id + ' #idPadre');
    var voltaje = document.querySelector('tr#' + tr.id + ' #voltajeValor');

    if (idPadre.value == 100 || idPadre.value == 102) {
        if (idPadre.value == 100) {
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('cooler').value = 0;
            document.getElementById('idGpu').value = 0;
            document.getElementById('socketCool').value = 0;
        } else if (idPadre.value == 102) {
            document.getElementById('voltajegpu').value = 0;
        }
        var totalW = document.getElementById('voltajecpu');
        var resta = parseFloat(totalW.value - voltaje.value);
        totalW.value = resta;
    }
    tbody.removeChild(tr);
    elimClase(idPadre.value);
    eliminarHidden(idPadre.value);
    alertify.error('Componente eliminado');
    totalizarVenta();
    totalizarVentaNormal();
    wats();
    obligatorios();
}