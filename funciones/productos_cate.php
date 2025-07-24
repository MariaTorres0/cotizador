<?php
require_once 'factor_class.php';
$factorClass = new FactorClass();

function redondear($valor)
{
    $float_redondeado = round($valor * 100) / 100;
    $float_redondeado = number_format($float_redondeado, 2, ".", "");
    return $float_redondeado;
}

function pathImg($idProducto)
{
    global $conexion;
    $sql = "SELECT  id_image FROM ps_image WHERE ps_image.id_product = $idProducto";
    $resultado = mysqli_query($conexion, $sql);
    if (mysqli_num_rows($resultado) > 0) {
        $filas = mysqli_fetch_array($resultado);

        return crearPath($filas[0]);
    }
    return crearPath("1969");
}

function crearPath($nombreImg)
{
    $cadena = $nombreImg . ".jpg";

    $separarId = explode("-", $cadena);
    $idSeparado = $separarId[0];
    $idSeparado = $nombreImg;
    $valorArray = array();

    for ($i = 0; $i < strlen($idSeparado); $i++) {
        array_push($valorArray, $idSeparado[$i]);
    }
    $rutaId = implode("/", $valorArray);

    $rutaFinal = "https://kpchardware.com/img/p/" . $rutaId . "/" . $cadena;

    return $rutaFinal;
}

function listarTodo($categoria)
{
    global $conexion;
    global $factorClass;
    $categoriaPadre = 100;

    $consulta = "SELECT ps_category.id_category, ps_category_lang.name FROM ps_category, ps_category_lang, ps_category_shop WHERE
     ps_category.id_parent = $categoria AND ps_category.id_category = ps_category_lang.id_category 
     AND ps_category.id_category = ps_category_shop.id_category AND ps_category_lang.id_lang=2
     ORDER BY ps_category_shop.position ASC";
    $resultado = mysqli_query($conexion, $consulta);


    while ($filas = mysqli_fetch_row($resultado)) { //trabaja con índices por eso se trae como [1]...
        $sqlCuenta = "SELECT ps_category_product.id_category AS categoria,
                               ps_category_lang.name           AS nombreCategoria,
                               ps_product_lang.name            AS productoNombre,
                               ps_product_lang.id_product,
                               ps_product.price,
                               ps_product.slots,
                               ps_product.voltaje,
                               ps_product.cooler, 
                               ps_product.gpu,
                               ps_product.socketCooler
                        FROM ps_category_product,
                             ps_product_lang,
                             ps_category_lang,
                             ps_product
                        WHERE ps_category_product.id_category = $filas[0] AND ps_category_product.id_category = ps_category_lang.id_category &&
                              ps_category_product.id_product = ps_product_lang.id_product && ps_product_lang.id_product = ps_product.id_product &&
                              ps_product.active = 1 AND ps_product_lang.id_lang=2 AND ps_category_lang.id_lang=2
                        order by price ASC;";

        $resCuenta = mysqli_query($conexion, $sqlCuenta);

        if (mysqli_num_rows($resCuenta) > 0) {
            echo "<div  class='card p-0'>
                <div class='card-header' id='heading$filas[0]'>
                    <h5 class='mb-0'>
                        <button class='btn btn-link collapsed' data-toggle='collapse' data-target='#collapse$filas[0]' aria-expanded='false' aria-controls='collapse$filas[0]'>
                            $filas[1]
                        </button>
                    </h5>
                </div>
                <div id='collapse$filas[0]' class='collapse p-0 p-lg-2' aria-labelledby='heading$filas[0]' data-parent='#accordion$categoria'>
                    <div class='card-body m-0 p-0 p-lg-2'><div class='row align-items-start'>";
            $consultaProds = "SELECT ps_category_product.id_category AS categoria,
                               ps_category_lang.name           AS nombreCategoria,
                               ps_product_lang.name            AS productoNombre,
                               ps_product_lang.id_product,
                               ps_product.price,
                               ps_product.slots,
                               ps_product.voltaje,
                               ps_product.cooler, 
                               ps_product.gpu,
                               ps_product.socketCooler
                        FROM ps_category_product,
                             ps_product_lang,
                             ps_category_lang,
                             ps_product
                        WHERE ps_category_product.id_category = $filas[0] AND ps_category_product.id_category = ps_category_lang.id_category &&
                              ps_category_product.id_product = ps_product_lang.id_product && ps_product_lang.id_product = ps_product.id_product &&
                              ps_product.active = 1
                              AND ps_product_lang.id_lang=2 AND ps_category_lang.id_lang=2
                        order by price ASC;";

            $resultadoProds = mysqli_query($conexion, $consultaProds);

            if (mysqli_num_rows($resultadoProds) == 0) {
                $style = "display:none";
                echo "<div class='col-12 alert-danger'><p class='text-center font-weight-bold.'>No se encontraron productos en esta categoría</div>";
            }
            while ($filasProd = mysqli_fetch_row($resultadoProds)) { //trabaja con índices por eso se trae como [1]...
                $precioNormal = $filasProd[4] * 1.13;
                $precioEfectivo = $precioNormal * $factorClass->getValor('FTJ')['valor'];

                if ($filasProd[7] == 1 && $filasProd[8] == 1) {
                    $text = "*Requiere cooler y GPU";
                } else if ($filasProd[7] == 1) {
                    $text = "*Requiere cooler";
                } else if ($filasProd[8] == 1) {
                    $text = "*Requiere GPU";
                } else {
                    $text = "";
                }
                $srcImg = pathImg($filasProd[3]);
                echo " 
                <div class='col-lg-4 col-md-6 col-sm-12 col-xs-12' >
                <div class='card bg-light mb-3' style='max-width: 18rem;'>
                    <div class='card-header p-1'>
                        <img src='$srcImg' style='max-width: 75px; max-height: 75px;' class='zoom'>
                        <p>$filasProd[2] <b>$text</b></p>
                        
                    </div>
                    <div class='card-body p-1 col-12'>
                        <p class='card-title font-weight-bold' style='color:#6D6D6B'>Precio normal: $ " . redondear($precioNormal) . "</p>
                        <p class='card-title text-success font-weight-bold'>Precio efectivo: $ " . redondear($precioEfectivo) . "</p>
                        <a class='btn btn-info btn-lg btn-block' style='color: #fff' href='javascript:void(0)' onclick='agregarTabla(\"$filasProd[2]\"," . redondear($precioNormal) . "," . redondear($precioEfectivo) . ", 1, $filasProd[3], $filas[0], $categoriaPadre, \"$filasProd[1]\", 1, $filasProd[6], $filasProd[7], $filasProd[8], $filasProd[9])'>+ Añadir</a>
                    </div>
                </div>
            </div>";
            }
            echo "</div></div>
                </div>
            </div>";
        }
    }
}

function listarPeri($categoria)
{
    global $factorClass;
    global $conexion;
    $sql = "SELECT
              ps_category_product.id_category AS categoria,
              ps_category_lang.name AS nombreCategoria,
              ps_product_lang.name AS productoNombre,
              ps_product_lang.id_product,
              ps_product.price,
              ps_product.slots
            FROM
              ps_category_product,
              ps_product_lang,
              ps_category_lang,
              ps_product
            WHERE
              ps_category_product.id_category = $categoria AND ps_category_product.id_category = ps_category_lang.id_category && ps_category_product.id_product = ps_product_lang.id_product && ps_product_lang.id_product = ps_product.id_product && ps_product.active = 1
              AND ps_product_lang.id_lang=2 AND ps_category_lang.id_lang=2
            ORDER BY
              price ASC;";

    $resultado = mysqli_query($conexion, $sql);
    echo "<div class='row align-items-start'>";
    if ($categoria == 82 || $categoria == 81 || $categoria == 80) {
        $categoria = 118;
    }
    if ($categoria == 50 || $categoria == 51 || $categoria == 52 || $categoria == 53) {
        $categoria = 119;
    }
    while ($filas = mysqli_fetch_row($resultado)) {
        $precioNormal = $filas[4] * 1.13;
        $precioEfectivo = $precioNormal * $factorClass->getValor('FTJ')['valor'];
        $cadenaNueva = str_replace("''", " ´´ ", $filas[2]);
        $srcImg = pathImg($filas[3]);
        echo "<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12' >
                <div class='card bg-light mb-3' style='max-width: 18rem;'>
                    <div class='card-header p-1'>
                        <img src='$srcImg' style='max-width: 75px; max-height: 75px;' class='zoom'>
                        <p>$filas[2]</p>
                    </div>
                    <div class='card-body p-1 col-12'>
                        <p class='card-title font-weight-bold' style='color:#6D6D6B'>Precio normal: $ " . redondear($precioNormal) . "</p>
                        <p class='card-title text-success font-weight-bold'>Precio efectivo: $ " . redondear($precioEfectivo) . "</p>
                        <a class='btn btn-info btn-lg btn-block' style='color: #fff' href='javascript:void(0)' onclick='agregarTabla(\"$cadenaNueva\"," . redondear($precioNormal) . "," . redondear($precioEfectivo) . ", 1, $filas[3], $filas[0], $categoria,\"$filas[1]\", 1)'>+ Añadir</a>
                    </div>
                </div>
            </div>";
    }
    echo "</div>";
}

//Nuevas funciones para cotizaciones

function obtenerCategoriasCoti($conexion)
{
    $query = "SELECT * FROM category_coti WHERE activo = 1 ORDER BY id_category_coti ASC";
    $result = mysqli_query($conexion, $query);
    $categorias = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $categorias[] = $row;
    }

    return $categorias;
}


$perifericos_ids = [110, 111, 113];

function mostrarCategoria($categoria, $index, $show = false, $color = '#565652', $showIcon = true)
{
    $btnId = $categoria['id_btn'] ?? "btn{$index}";
    $collapseId = "collapse{$index}";
    $headingId = "heading{$index}";
    $bodyId = $categoria['nombre'] . 'Body';
    $expanded = $show ? 'true' : 'false';
    $collapseClass = $show ? 'collapse show' : 'collapse';
    $btnCollapsed = $show ? '' : 'collapsed';

    echo "<div class='card'>
            <div class='card-header degradadoGris' id='{$headingId}'>
                <h2 class='mb-0 text-left'>
                    <button class='btn btn-link {$btnCollapsed}' id='{$btnId}Btn' style='color: {$color};' type='button'
                        data-toggle='collapse' data-target='#{$collapseId}' aria-expanded='{$expanded}' aria-controls='{$collapseId}'>
                        ";

    if ($showIcon) {
        $iconColor = ($categoria['obligatorio'] ?? 0) == 1 ? 'red' : '';
        $iconClass = ($categoria['obligatorio'] ?? 0) == 1 ? 'fas fa-times' : 'fas fa-exclamation';
        echo "<img src='iconos_cat/{$categoria['icono']}' width='40' height='40' style='vertical-align: middle; margin-right: 8px;' />";
        echo "<span>{$categoria['nombre']}</span>";
        echo "<i class='{$iconClass}' id='{$categoria['id_category']}' style='color: {$iconColor}; margin-left: 8px;'></i>";
    } else {
        echo $categoria['nombre'];
    }

    echo       "</button>
                </h2>
            </div>
            <div id='{$collapseId}' class='{$collapseClass}' aria-labelledby='{$headingId}' data-parent='#accordionExample'>
                <div class='card-body' id='{$bodyId}'></div>
            </div>
        </div>";
}