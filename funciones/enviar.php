<?php
require_once 'factor_class.php';
$factorClass = new FactorClass();

if (isset($_POST["enviado"])) {
    //Datos del cliente
    $nombre = $_POST["nombreCliente"];
    $correo = $_POST["correoCliente"];
    $numero = $_POST["telCliente"];
    $comentarios = $_POST["comentarios"];


    $enviado = enviar($correo, $nombre, $numero, $comentarios);

    if ($enviado == 1) {
        echo "<script>
                function prueba() {
                    alert('Tus datos fueron enviados. Gracias por usar nuestro configurador.');
                    location.replace('https://www.kpchardware.com');
                }
                prueba();
            </script>";
    }
}

function enviar($email, $nombre, $numero, $comentarios)
{
    global $factorClass;
    $titulo = "Cotización de $nombre";

    $mensaje = '<html>' .
        '<head><title>Email con HTML</title></head>' .
        "<body><h3>Detalles de la cotización de $nombre</h3><hr>" .
        '<b>Nombre: </b>' . $nombre .
        '<br>' .
        '<b>Número telefónico: </b>' . $numero .
        '<br>' .
        '<b>Correo electrónico: </b>' . $email .
        '<br>' .
        '<b>Comentarios extra: </b>' . $comentarios .
        '<hr><h3>Componentes seleccionados:</h3><table border="1"> 
            <tr align="center">
                <td><b>Componente</b></td>
                <td><b>Precio normal</b></td>
                <td><b>Precio efectivo</b></td>
                <td><b>Total Fila</b></td>
                <td><b>Cantidad</b></td>
            </tr>';

    //DATOS PARA LLENAR EL BUCLE Y SACAR NOMBRES INDIVIDUALES.
    $nombreProd = $_POST["nombre"];
    $idPadre = $_POST["catePadre"];
    $precioProdEf = $_POST["precioEfectivo"];
    $totalFila = $_POST["totalDetalle"];
    $cantidad = $_POST["cantidadEnviar"];
    $totalNormal = $_POST["totalVentaNormal"];
    $totalEfectivo = $_POST["totalVentaEfectivo"];
    $terminos = $_POST["terminos"];

    while (true) {
        $itemNombre = current($nombreProd);
        $itemPadre = current($idPadre);
        $itemPrecioProd = current($precioProdEf);
        $itemTotalFila = current($totalFila);
        $itemCantidad = current($cantidad);

        $mensaje .= "<tr align='center'>" .
            "<td>$itemNombre</td>" .
            "<td >$ " . redondear($itemPrecioProd / $factorClass->getValor('FTJ')['valor']) . "</td>" .
            "<td>$ " . redondear($itemPrecioProd) . "</td>" .
            "<td>$ " . redondear($itemTotalFila) . "</td>" .
            "<td>$itemCantidad</td>" .
            "<tr>";

        $itemNombre = next($nombreProd);
        $itemPadre = next($idPadre);
        $itemPrecioProd = next($precioProdEf);
        $itemTotalFila = next($totalFila);
        $itemCantidad = next($cantidad);

        if ($itemNombre == false && $itemPadre == false && $itemPrecioProd == false && $itemTotalFila == false && $itemCantidad == false)
            break;
    }

    $mensaje .= ' </table>' .
        "<p><b>Total efectivo: $totalEfectivo</b></p>" .
        "<p><b>Total normal: $totalNormal</b></p>" .
        "<p><b>¿Aceptó llamada?: $terminos</b></p>" .
        '</body>' .
        '</html>';
    $cabeceras = 'MIME-Version: 1.0' . "\r\n";
    $cabeceras .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $cabeceras .= "From: $nombre";

    $enviado = mail("cotizador@kpchardware.com", $titulo, $mensaje, $cabeceras);

    if ($enviado) {
        return 1;
    } else {
        return 0;
    }
}

function redondear($valor)
{
    $float_redondeado = round($valor * 100) / 100;
    $float_redondeado = number_format($float_redondeado, 2, ".", "");
    return $float_redondeado;
}
