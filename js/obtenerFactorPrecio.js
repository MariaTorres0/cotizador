function obtenerValorFactor(codigoFactor) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'funciones/factor_precio_ajax.php',
            type: 'POST',
            data: {
                codigo: codigoFactor,
            },
            success: function (respuesta) {
                resolve(respuesta)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}