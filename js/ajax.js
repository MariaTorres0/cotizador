$('#placaBaseBtn').on('click', function () {
    BuscarById();
});

$('#caseBtn').on('click', function () {
    var idMobo = document.getElementById('idMobo');
    buscarProductos(idMobo.value, 'bodyCase', 103, 0, 0);
});

$('#ramBtn').on('click', function () {
    var idMobo = document.getElementById('idMobo');
    buscarProductos(idMobo.value, 'ramBody', 101, 0, 0);
});

$('#gpuBtn').on('click', function () {
    var idMobo = document.getElementById('idMobo');
    buscarProductos(idMobo.value, 'gpuBody', 102, 0, 0);
});

$('#airBtn').on('click', function () {
    var idCase = document.getElementById('idCase');
    var socketCool = document.getElementById('socketCool');
    buscarProductos(idCase.value, 'airBody', 104, 1, socketCool.value);
});

$('#fuenteBtn').on('click', function () {
    var voltaje = document.getElementById('voltaje');
    buscarProductos(voltaje.value, 'fuenteBody', 100, 3, 0);
});

$('#liquiBtn').on('click', function () {
    var idCase = document.getElementById('idCase');
    var socketCool = document.getElementById('socketCool');
    buscarProductos(idCase.value, 'liquiBody', 105, 1, socketCool.value);
});

function buscarProductos(id, bodyId, tipo, opcion, socket) {
    $('#' + bodyId).empty();
    $('#' + bodyId).html('<div class="loading"><img src="./img/91.gif" alt="loading" width="30px" height="30px"/><br/>Espere...</div>');
    $.ajax({
        url: 'funciones/ajaxDatos.php',
        type: 'POST',
        data: {
            id: id,
            idPadre: tipo,
            tipo: opcion,
            socket: socket
        },
        success: function (response) {
            console.log(response);
            $('#' + bodyId).fadeIn(1000).html(response);
        }
    });
}

function BuscarById() {
    var categoriaProc = $('#catProce').val();
    categoriaProc = categoriaProc.replace(/\([^)]*\)/g, '');
    $('#bodyPB').empty();
    $('#bodyPB').html('<div class="loading"><img src="./img/91.gif" alt="loading" width="30px" height="30px"/><br/>Espere...</div>');
    $.ajax({
        url: 'funciones/ajax_data.php',
        type: 'POST',
        data: {
            categoriaProc: categoriaProc
        },
        success: function (response) {
            $('#bodyPB').fadeIn(1000).html(response);
        }
    });
}
