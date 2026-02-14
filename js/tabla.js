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
    110: 'collapsePeri', 111: 'collapsePeri', 113: 'collapsePeri',  153: 'collapsePeri',  152: 'collapsePeri',  112: 'collapsePeri',
    119: 'collapseMoni',
    122: 'collapseUps'
};

// Categorias que NO deben cerrar el menu al seleccionarse
const mantenerAbierto = [101, 118, 110, 111, 119, 113, 153, 152, 112];

// Categorias obligatorias basicas para validar
const catsCriticas = ['fila100', 'fila101', 'fila102', 'fila109', 'fila103']; // CPU, Mobo, GPU, Fuente, Case

// Caché de elementos DOM para mejorar rendimiento
const domCache = {
    lista: null,
    slotsMobo: null,
    voltaje: null,
    voltajecpu: null,
    voltajegpu: null,
    totalWatts: null,
    gpuNeed: null,
    coolNeed: null,
    totalVenta: null,
    totalVentaEfectivo: null,
    totalVentaTarjeta: null,
    totalVentaNormal: null,
    init() {
        this.lista = document.getElementById('lista');
        this.slotsMobo = document.getElementById('slotsMobo');
        this.voltaje = document.getElementById('voltaje');
        this.voltajecpu = document.getElementById('voltajecpu');
        this.voltajegpu = document.getElementById('voltajegpu');
        this.totalWatts = document.getElementById('totalWatts');
        this.gpuNeed = document.getElementById('gpuNeed');
        this.coolNeed = document.getElementById('coolNeed');
        this.totalVenta = document.querySelector('#totalVenta');
        this.totalVentaEfectivo = document.getElementById('totalVentaEfectivo');
        this.totalVentaTarjeta = document.querySelector('#totalVentaTarjeta');
        this.totalVentaNormal = document.getElementById('totalVentaNormal');
    }
};

window.onload = () => {
    domCache.init();
    mostrarAlertaBienvenida();
};

/* ==========================================
   FUNCIONES DE UI Y NAVEGACIÓN
   ========================================== */

function mostrarAlertaBienvenida() {
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
        Swal.fire({
            icon: 'info',
            title: '<span style="color: #e8e8e8;">Recuerda que...</span>',
            html: '<p style="font-size: 16px; color: #e8e8e8; margin: 10px 0;">Recuerda que el precio final de tu configuración <strong style="color: #e73d2c;">tendrá descuento</strong> cuando envíes tu cotización.</p>',
            iconColor: '#3d8bb5',
            confirmButtonText: '¡Entendido!',
            confirmButtonColor: '#e73d2c',
            background: 'linear-gradient(135deg, #2d3d47 0%, #252f38 100%)',
            backdrop: 'rgba(0, 0, 0, 0.7)',
            timer: 5000,
            timerProgressBar: true,
            showClass: {
                popup: 'swal-show-animation',
                backdrop: 'swal-backdrop-show'
            },
            hideClass: {
                popup: 'swal-hide-animation',
                backdrop: 'swal-backdrop-hide'
            },
            willOpen: () => {
                const popup = Swal.getPopup();
                popup.style.cssText = 'box-shadow: 0 12px 35px rgba(61, 139, 181, 0.4), 0 6px 20px rgba(231, 61, 44, 0.3); border-radius: 12px; border: 2px solid rgba(61, 139, 181, 0.3); will-change: transform, opacity;';
            }
        });
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
    const filasTabla = domCache.lista.rows;
    const categoriasEnTabla = [];

    // Obtener qué categorias estan presentes - Optimizado
    for (let i = 0; i < filasTabla.length; i++) {
        const idFila = filasTabla[i].id;
        if (!idFila) continue;
        const dashPos = idFila.indexOf('-');
        if (dashPos > 0) {
            const idPadre = parseInt(idFila.substring(4, dashPos));
            if (!isNaN(idPadre)) categoriasEnTabla.push(idPadre);
        }
    }

    // Variables de estado usando caché
    const tieneGpu = categoriasEnTabla.includes(102);
    const tieneCooler = categoriasEnTabla.includes(104) || categoriasEnTabla.includes(105);
    const gpuObligatoria = domCache.gpuNeed.value == 1;
    const coolerObligatorio = domCache.coolNeed.value == 1;

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
    if (domCache.totalWatts) {
        const vCpu = parseFloat(domCache.voltajecpu.value) || 0;
        const vGpu = parseFloat(domCache.voltajegpu.value) || 0;
        domCache.totalWatts.textContent = (vCpu + vGpu).toFixed(2);
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
    const actual = parseFloat(domCache.voltaje.value) || 0;
    domCache.voltaje.value = (actual + parseFloat(voltajeItem));
}

function socket(socketType) {
    document.getElementById('socketCool').value = socketType;
}

/* ===============================
   GESTIÓN DE LA TABLA
   =============================== */

function agregarTabla(nombreProducto, precioNormal, precioEfectivo, cantidad, idProducto, idCategoria, idCategoriaPadre, nombreCategoria, slotsPCI, slotsRam, voltaje, gpu, tamanioMoboCase, cooler) {

    // Solo si es RAM (101) tomamos el valor real, si no, vale 1
    let pesoSlot = (idCategoriaPadre == 101) ? (parseInt(slotsRam) || 1) : 1;

    if (buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precioEfectivo, nombreProducto)) return;

    const idFila = `fila${idCategoriaPadre}-${idProducto}`;
    let filaExistente = document.getElementById(idFila);
    const slotsDisponibles = parseInt(domCache.slotsMobo.value) || 0;

    if (filaExistente) {
        const inputCanti = filaExistente.querySelector('#canti');
        const inputSubtotal = filaExistente.querySelector('#totalDetalle');
        const nuevaCantidad = parseInt(inputCanti.value) + parseInt(cantidad);

        // --- VALIDACIÓN EXCLUSIVA PARA RAM (101) ---
        if (idCategoriaPadre == 101) {
            let slotsOcupados = 0;
            // Optimizado: obtener todas las filas RAM de una vez
            const filasRam = domCache.lista.querySelectorAll('tr[id^="fila101-"]');
            for (const fila of filasRam) {
                let qty = parseInt(fila.querySelector('#canti').value) || 0;
                if (fila.id === idFila) qty = nuevaCantidad;
                const peso = parseInt(fila.querySelector('#valSlotsRam').value) || 1;
                slotsOcupados += (qty * peso);
            }


            if (slotsOcupados > slotsDisponibles) {
                alertify.error(`No hay suficientes slots. Intentas ocupar ${slotsOcupados} de ${slotsDisponibles}.`);
                return;
            }
            if (slotsOcupados === slotsDisponibles) {
                setTimeout(() => { $('#collapseRam').collapse('hide'); }, 300);
            }
        }

        const nuevoSubtotal = nuevaCantidad * precioEfectivo;
        inputCanti.value = nuevaCantidad;

        // Actualizamos filas - batch update para reducir reflows
        const tdCantidad = filaExistente.querySelector('td:nth-child(4)');
        const tdSubtotal = filaExistente.querySelector('td:nth-child(3)');
        
        tdCantidad.innerHTML = `
            <input type="hidden" id="canti" name="cantidadEnviar[]" value="${nuevaCantidad}">
            ${nuevaCantidad}
            <input type="hidden" id="cantidad" name="cantidad[]" value="${nuevaCantidad}">`;
        
        inputSubtotal.value = nuevoSubtotal;
        tdSubtotal.innerHTML = `
            <input type="hidden" id="totalDetalle" name="totalDetalle[]" value="${nuevoSubtotal}">
            <input type="hidden" id="valSlotsRam" value="${pesoSlot}">
            $${nuevoSubtotal.toFixed(2)}`;

        alertify.success('Cantidad actualizada');
    }
    else {
        // --- VALIDACIÓN EXCLUSIVA PARA RAM (101) ---
        if (idCategoriaPadre == 101) {
            let slotsOcupados = 0;
            const filasRam = domCache.lista.querySelectorAll('tr[id^="fila101-"]');
            for (const fila of filasRam) {
                const qty = parseInt(fila.querySelector('#canti').value) || 0;
                const peso = parseInt(fila.querySelector('#valSlotsRam').value) || 1;
                slotsOcupados += (qty * peso);
            }

            let slotsNuevos = cantidad * pesoSlot;

            if (slotsOcupados + slotsNuevos > slotsDisponibles) {
                alertify.error(`No hay suficientes slots. Intentas ocupar ${slotsNuevos} más, excediendo el límite.`);
                return;
            }
            if (slotsOcupados + slotsNuevos === slotsDisponibles) {
                setTimeout(() => { $('#collapseRam').collapse('hide'); }, 300);
            }
        } else {
            cerrarMenu(idCategoriaPadre);
        }

        pasarId(idProducto, idCategoriaPadre, slotsPCI); 

        if (idCategoriaPadre == 100) {
            document.getElementById('idProceCat').value = idCategoria;
        }
        else if (idCategoriaPadre == 99) {
            document.getElementById('idMoboCat').value = idCategoria;
            document.getElementById('idTamanioMoboCase').value = tamanioMoboCase;
        }
        else if (idCategoriaPadre == 103) {
            document.getElementById('idCaseCat').value = idCategoria;
        }

        // Logica Procesador
        if (idCategoriaPadre == 100) {
            domCache.gpuNeed.value = gpu;
            domCache.coolNeed.value = cooler || 0; 

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

            // Check GPU
            if (gpu == 1) {
                let hayGpu = document.querySelector('tr[id^="fila102-"]');
                if (!hayGpu) resetearVisual(102, false);
            } else {
                let hayGpu = document.querySelector('tr[id^="fila102-"]');
                if (!hayGpu) resetearVisualGpuWarning();
            }
        }

        if (idCategoriaPadre == 103) {
            document.getElementById('idCaseCat').value = idCategoria;
        }

        if (idCategoriaPadre == 99) document.getElementById('idMoboCat').value = idCategoria;
        cambiarClase(idCategoriaPadre);

        if (idCategoriaPadre == 104) cambiarClase(105);
        if (idCategoriaPadre == 105) cambiarClase(104);

        if (voltaje > 0 && (idCategoriaPadre == 100 || idCategoriaPadre == 102)) {
            const factor = (idCategoriaPadre == 102) ? 1.2 : 2;
            const voltajeProcesado = (voltaje * factor).toFixed(2);

            if (idCategoriaPadre == 100) {
                domCache.voltajecpu.value = voltajeProcesado;
            } else if (idCategoriaPadre == 102) {
                domCache.voltajegpu.value = voltajeProcesado;
            }

            const vCpu = parseFloat(domCache.voltajecpu.value) || 0;
            const vGpu = parseFloat(domCache.voltajegpu.value) || 0;
            domCache.voltaje.value = (vCpu + vGpu).toFixed(2);
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
                    <input type="hidden" id="valSlotsRam" value="${pesoSlot}">
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

        if (idCategoriaPadre != 101 && ![118, 110, 111, 113, 153, 152, 112, 119, 122, 106].includes(parseInt(idCategoriaPadre))) {
            marcarCardVisualmente(idProducto);
        }
    }

    actualizarTotales();
    if (idCategoriaPadre == 101) sacarCantidades(idCategoriaPadre);

    if (idCategoriaPadre == 101 || idCategoriaPadre == 99) {
        actualizarVisualRam();
    }
}

/* ============================
   GESTIÓN DE LA TABLA 
   ============================ */

function eliminarFilas(boton) {
    const fila = boton.closest('tr');
    const inputIdProd = fila.querySelector('#idProducto');
    const idProductoAEliminar = inputIdProd ? inputIdProd.value : null;
    const idPadre = parseInt(fila.querySelector('#idPadre').value);
    const wattsItem = parseFloat(fila.querySelector('#voltajeValor')?.value || 0);
    const nuevoVoltaje = (parseFloat(domCache.voltaje.value) || 0) - wattsItem;
    domCache.voltaje.value = Math.max(0, nuevoVoltaje);

    // Eliminacion masiva
    if (idPadre === 100 || idPadre === 99 || idPadre === 103) {

        if (idPadre === 100) {
            document.getElementById('idProceCat').value = "";
            document.getElementById('voltajecpu').value = 0;
            document.getElementById('coolNeed').value = 0;
            document.getElementById('gpuNeed').value = 0;
        }

        eliminarHidden(idPadre);
        alertify.error('Componente eliminado');

    } else {
        // Eliminacion individual
        fila.remove();
        if (idProductoAEliminar) desmarcarCardVisualmente(idProductoAEliminar);
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
            
            // Limpiezas adicionales específicas para cada categoría
            if (idPadre === 101) {
                document.getElementById('totalCantidad').value = 0;
            }
            if (idPadre === 99) {
                document.getElementById('idMoboCat').value = '';
                document.getElementById('idTamanioMoboCase').value = '';
            }
            if (idPadre === 103) {
                document.getElementById('idCaseCat').value = '';
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
    actualizarVisualRam();
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
            idsAEliminar = [99, 103, 101, 102, 109, 118, 104, 105, 999, 119, 122, 106, 121];
            break;
        case 99:
            idsAEliminar = [103, 101, 102, 109, 118, 104, 105, 999, 119, 122, 106, 121];
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
        if (catActual === 100) {
            $('#collapseCpu').collapse('hide');
            document.getElementById('idMoboCat').value = '';
            document.getElementById('idCaseCat').value = '';
            document.getElementById('idTamanioMoboCase').value = '';
        }
        if (catActual === 99) {
            document.getElementById('catMobo').value = '';
            document.getElementById('slotsMobo').value = 0;
            document.getElementById('idMoboCat').value = '';
            document.getElementById('idCaseCat').value = '';
            document.getElementById('idTamanioMoboCase').value = '';
            actualizarVisualRam();
        }
        if (catActual === 101) {
            document.getElementById('totalCantidad').value = 0;
        }
        if (catActual === 103) {
            document.getElementById('idCaseCat').value = '';
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
    el.style.color = '#01c94d';
    $(el).closest('.card-header').css('background', '#01752e');
}

function resetearVisualGpuWarning() {
    var el = document.getElementById(102);
    if (!el) return;

    $(el).removeClass('fas fa-check fas fa-times').addClass('fas fa-exclamation');
    el.style.color = '#ff6100';
}

function resetearVisual(id, alerta = true) {
    var el = document.getElementById(id);
    if (!el) return;

    $(el).removeClass('fas fa-check fas fa-exclamation').addClass('fas fa-times');
    el.style.color = 'red';

    if (alerta) {
        $(el).closest('.card-header').css('background', '#920d00');
    } else {
    }
}

function elimClase(idCategoria, teniaProductos) {
    idCategoria = parseInt(idCategoria);
    var el = document.getElementById(idCategoria);

    if (!el && idCategoria === 999) el = document.getElementById('999') || document.getElementById('110');

    if (!el) return;

    // GRUPOS
    const grupoAmarillo = [102, 104, 105, 999, 119, 122, 106, 121];
    const grupoRojo = [100, 99, 101, 103, 109, 118];

    // Primero limpiamos todas las clases de estado
    $(el).removeClass('fas fa-check fa-times fa-exclamation');

    // LOGICA GRUPO AMARILLO
    if (grupoAmarillo.includes(idCategoria)) {
        let esObligatorio = false;

        if (idCategoria === 102 && parseInt(document.getElementById('gpuNeed').value) === 1) esObligatorio = true;
        if ((idCategoria === 104 || idCategoria === 105) && parseInt(document.getElementById('coolNeed').value) === 1) esObligatorio = true;

        if (esObligatorio) {
            $(el).addClass('fas fa-times');
            el.style.color = 'red';
            if (teniaProductos) $(el).closest('.card-header').css('background', '#920d00');
        } else {
            // Si es opcional vacío, se queda en advertencia
            $(el).addClass('fas fa-exclamation');
            el.style.color = '#ff6100';
            if (teniaProductos) $(el).closest('.card-header').css('background', '#c99d17');
            else {
                // Si no tenía productos, limpiamos el fondo para que quede limpio
                $(el).closest('.card-header').css('background', '');
            }
        }
    }
    // LOGICA GRUPO ROJO
    else if (grupoRojo.includes(idCategoria)) {
        if (teniaProductos) {
            // Si acabamos de borrar un producto que existía, marcamos rojo
            $(el).addClass('fas fa-times');
            el.style.color = 'red';
            $(el).closest('.card-header').css('background', '#920d00');
        } else {
            // Si ya estaba vacío, lo reseteamos a estado neutro
            $(el).addClass('fas fa-times');

            el.style.color = 'red';
            $(el).closest('.card-header').css('background', '');
        }
    }
}

/* ================================
   HELPERS Y UTILIDADES
   ================================ */

function actualizarTotales() {
    const inputsDetalle = domCache.lista.querySelectorAll('#totalDetalle');
    let suma = 0;
    
    // Optimizado: for loop más rápido que forEach
    for (let i = 0; i < inputsDetalle.length; i++) {
        suma += parseFloat(inputsDetalle[i].value) || 0;
    }
    
    const sumaFmt = suma.toFixed(2);
    
    // Batch DOM updates
    if (domCache.totalVenta) domCache.totalVenta.textContent = ' ' + sumaFmt;
    if (domCache.totalVentaEfectivo) domCache.totalVentaEfectivo.value = '$ ' + sumaFmt;

    // Tarjeta
    obtenerValorFactor('FTJ').then(res => {
        const totalTarj = (suma / res.valor).toFixed(2);
        if (domCache.totalVentaTarjeta) domCache.totalVentaTarjeta.textContent = ' ' + totalTarj;
        if (domCache.totalVentaNormal) domCache.totalVentaNormal.value = '$ ' + totalTarj;
    }).catch(err => console.error('Error factor:', err));
}

function totalizarVenta() { actualizarTotales(); }
function totalizarVentaNormal() { actualizarTotales(); }

function buscarValorEnFila(idCategoriaPadre, idProducto, cantidad, precio, nombre) {
    const filasTabla = domCache.lista.rows.length;
    const idCat = parseInt(idCategoriaPadre);

    // Validar orden de insercion
    if (filasTabla < 3 && (idCat != 100 && idCat != 99)) {
        alertify.error('Antes debes agregar un procesador y una placa base');
        return true;
    }

    // CATEGORIAS MULTIPLES 
    if ([101, 118, 119, 110, 111, 113, 153, 152, 112, 999, 106, 121].includes(idCat)) {
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

function marcarCardVisualmente(idProducto, idCategoriaPadre) {
    let card = document.getElementById('card-prod-' + idProducto);

    // Lista completa de categorias multiples
    const categoriasMultiples = [101, 118, 110, 111, 113, 153, 152, 112, 119, 122, 999, 106, 121];

    if (card) {
        card.classList.add('producto-agregado');

        let check = card.querySelector('.check-overlay');
        if (check) check.style.display = 'block';

        let btn = card.querySelector('.btn-agregar-producto');

        if (btn) {
            if (!idCategoriaPadre) {
                idCategoriaPadre = parseInt(btn.getAttribute('data-cate-principal'));
            }

            if (categoriasMultiples.includes(idCategoriaPadre)) {

                if (idCategoriaPadre == 101) {
                    let slotsInput = document.getElementById('slotsMobo');
                    let slotsTotal = slotsInput ? (parseInt(slotsInput.value) || 0) : 0;
                    let ramsUsadas = 0;

                    // Contamos reales en la tabla
                    document.querySelectorAll('tr[id^="fila101-"] input[name="cantidadEnviar[]"]').forEach(input => {
                        ramsUsadas += parseInt(input.value) || 0;
                    });

                    if (ramsUsadas >= slotsTotal && slotsTotal > 0) {
                        btn.innerHTML = 'Agregado';
                        btn.classList.remove('btn-info');
                        btn.classList.add('btn-success');
                    }
                    else {
                        btn.innerHTML = '+ Agregar';
                        btn.classList.remove('btn-success');
                        btn.classList.add('btn-info');
                    }
                }
                else {
                    btn.innerHTML = '+ Agregar';
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-info');
                }

            } else {
                btn.innerHTML = 'Agregado';
                btn.classList.remove('btn-info');
                btn.classList.add('btn-success');
            }
        }
    }
}

function desmarcarCardVisualmente(idProducto) {
    let card = document.getElementById('card-prod-' + idProducto);
    if (card) {
        card.classList.remove('producto-agregado');

        let check = card.querySelector('.check-overlay');
        if (check) check.style.display = 'none';

        // Restaurar boton
        let btn = card.querySelector('.btn-agregar-producto');
        if (btn) {
            btn.innerHTML = '+ Agregar';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-info');
        }
    }
}

function actualizarVisualRam() {
    let slotsInput = document.getElementById('slotsMobo');
    let slotsTotal = slotsInput ? (parseInt(slotsInput.value) || 0) : 0;
    let slotsOcupadosReales = 0;

    // Recorremos la tabla buscando el input hidden que agregamos antes
    document.querySelectorAll('tr[id^="fila101-"]').forEach(fila => {
        let cantidad = parseInt(fila.querySelector('input[name="cantidadEnviar[]"]').value) || 0;
        let pesoSlot = parseInt(fila.querySelector('#valSlotsRam').value) || 1;

        slotsOcupadosReales += (cantidad * pesoSlot);
    });

    // Solo buscamos el contenedor ÚNICO
    const containerPrincipal = document.getElementById('ram-live-container');

    if (containerPrincipal) {
        const textoCounter = containerPrincipal.querySelector('.ram-counter-text');
        if (textoCounter) textoCounter.innerHTML = `Slots: ${slotsOcupadosReales} / ${slotsTotal}`;

        const indicatorsContainer = containerPrincipal.querySelector('.ram-indicators-container');
        if (indicatorsContainer) {
            let indicatorsHtml = '';
            for (let i = 0; i < slotsTotal; i++) {
                // Si el índice es menor a los slots ocupados reales, se pinta
                let estadoClass = (i < slotsOcupadosReales) ? 'filled' : '';
                indicatorsHtml += `<div class="ram-slot-indicator ${estadoClass}"></div>`;
            }
            indicatorsContainer.innerHTML = indicatorsHtml;
        }

        containerPrincipal.classList.remove('full-capacity', 'no-slots');
        if (slotsTotal === 0) containerPrincipal.classList.add('no-slots');
        else if (slotsOcupadosReales >= slotsTotal && slotsTotal > 0) containerPrincipal.classList.add('full-capacity');
    }
}

/* ======================================
   ACCORDION: CLICK EN TODA LA CABECERA
   ====================================== */
document.addEventListener('click', function (event) {
    const header = event.target.closest('.accordion .card-header');
    if (!header) return;

    // Si ya se hizo click en el boton, no hacemos doble toggle
    if (event.target.closest('.btn-link, button, a, input, select, textarea')) return;

    const toggleButton = header.querySelector('[data-toggle="collapse"], .btn-link');
    if (toggleButton) toggleButton.click();
});