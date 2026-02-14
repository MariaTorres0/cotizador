<?php
require "../funciones/conexion.php";
require '../funciones/factor_class.php';

$factorClass = new FactorClass();

function redondear_ajax($valor) {
    return number_format(round($valor * 100) / 100, 2, ".", "");
}

function pathImg_ajax($conexion, $idProducto) {
    $sql = "SELECT id_image FROM ps_image WHERE ps_image.id_product = $idProducto ORDER BY position ASC LIMIT 1";
    $resultado = mysqli_query($conexion, $sql);
    if (mysqli_num_rows($resultado) > 0) {
        $filas = mysqli_fetch_array($resultado);
        return crearPath_ajax($filas[0]);
    }
    return crearPath_ajax("1969");
}

function crearPath_ajax($nombreImg) {
    $cadena = $nombreImg . ".jpg";
    $idSeparado = $nombreImg;
    $valorArray = array();
    for ($i = 0; $i < strlen($idSeparado); $i++) {
        array_push($valorArray, $idSeparado[$i]);
    }
    $rutaId = implode("/", $valorArray);
    return "https://kpchardware.com/img/p/" . $rutaId . "/" . $cadena;
}

// Obtener datos POST
$wattsRequeridos = isset($_POST['watts']) ? floatval($_POST['watts']) : 0;
$catePrincipal = isset($_POST['id_cat_case']) ? intval($_POST['id_cat_case']) : 0; 
$catePadreFuentes = 109; 
$idIdioma = 2;

$filtroCategoriasCompatibles = "";

// Logica de asociacion
if ($catePrincipal > 0) {
    
    // Buscamos reglas de asociación
    $sqlNivel = "SELECT tipo_asoc_padre FROM cate_asociado 
                 WHERE cate_principal = $catePrincipal AND cate_padre = $catePadreFuentes AND compatibilidad = 1
                 ORDER BY tipo_asoc_padre DESC LIMIT 1";
    $resNivel = mysqli_query($conexion, $sqlNivel);

    $idsEncontrados = false; 

    if (mysqli_num_rows($resNivel) > 0) {
        $fila = mysqli_fetch_assoc($resNivel);
        $tipo_asoc = $fila['tipo_asoc_padre'];

        $sqlIds = "SELECT id_cat_asociado FROM cate_asociado 
                   WHERE cate_principal = $catePrincipal AND cate_padre = $catePadreFuentes AND tipo_asoc_padre = $tipo_asoc AND compatibilidad = 1";
        $resIds = mysqli_query($conexion, $sqlIds);

        $ids = [];
        while ($row = mysqli_fetch_assoc($resIds)) {
            $ids[] = $row['id_cat_asociado'];
        }
        
        if (!empty($ids)) {
            $lista_ids = implode(',', $ids);
            $filtroCategoriasCompatibles = " AND cp.id_category IN ($lista_ids) ";
            $idsEncontrados = true;
        }
    }

    if (!$idsEncontrados) {
        $filtroCategoriasCompatibles = " AND 1 = 0 ";
    }
}

$sqlProd = "SELECT DISTINCT p.id_product, p.id_category_default, pl.name AS productoNombre, 
                   p.price, p.reference, p.slots, p.voltaje, p.cooler, p.gpu, p.socketCooler,
                   cl.name AS nombreCategoria
            FROM ps_product p
            INNER JOIN ps_product_lang pl ON p.id_product = pl.id_product
            INNER JOIN ps_category_lang cl ON p.id_category_default = cl.id_category
            INNER JOIN ps_category_product cp ON p.id_product = cp.id_product 
            WHERE p.active = 1 
              AND p.voltaje >= $wattsRequeridos
              $filtroCategoriasCompatibles
              AND pl.id_lang = $idIdioma 
              AND cl.id_lang = $idIdioma
            ORDER BY p.voltaje ASC, p.price ASC";

$resProd = mysqli_query($conexion, $sqlProd);

if ($resProd && mysqli_num_rows($resProd) > 0) {
    echo '<div class="row">';
    while ($prod = mysqli_fetch_assoc($resProd)) {
        $precioNormal = redondear_ajax($prod['price'] * 1.13);
        $precioEfectivo = redondear_ajax($precioNormal * $factorClass->getValor('FTJ')['valor']);
        $srcImg = pathImg_ajax($conexion, $prod['id_product']);
        $nombreProductoJS = str_replace(['"', "'"], '', $prod['productoNombre']);
        $nombreCategoriaJS = str_replace(['"', "'"], '', $prod['nombreCategoria']);
        $onclick = "agregarTabla(\"{$nombreProductoJS}\", {$precioNormal}, {$precioEfectivo}, 1, {$prod['id_product']}, {$prod['id_category_default']}, 109, \"{$nombreCategoriaJS}\", 0, 0, {$prod['voltaje']}, 0, \"0\", 0)";

        echo "<div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
                <div class='card mb-8 product-card degradadoGris' id='card-prod-{$prod['id_product']}'>
                    <div class='card-header p-1 text-center product-header' style='position: relative;'>
                        <div class='check-overlay' style='display:none; position: absolute; top: 5px; right: 5px; z-index: 10;'>
                            <i class='fas fa-check-circle' style='color: #28a745; font-size: 24px; background: white; border-radius: 50%;'></i>
                        </div>
                        <img src='{$srcImg}' style='max-width: 75px; max-height: 75px;' class='zoom mt-3'><br>
                        <p>{$prod['productoNombre']}</p>
                    </div>
                    <div class='card-body p-2'>
                        <p class='card-title font-weight-bold'>Precio normal: $ {$precioNormal}</p>
                        <p class='card-title text-success font-weight-bold'>Precio efectivo: $ {$precioEfectivo}</p>
                        <a class='btn btn-info btn-lg btn-block btn-agregar-producto' 
                        style='color:#fff' 
                        href='javascript:void(0)' 
                        data-cate-principal='{$prod['id_category_default']}'
                        onclick='{$onclick}'>+ Agregar</a>
                    </div>
                </div>
            </div>";
    }
    echo '</div>';
} else {
    // Mensaje de no se encontraron productos    
    if ($catePrincipal > 0) {
        $txtError = "No se encontraron fuentes de {$wattsRequeridos}W compatibles con la categoría de gabinete seleccionada.";
    } else {
        $txtError = "No se encontraron fuentes de {$wattsRequeridos}W.";
    }

    echo "<div class='col-12'>
            <div class='alert alert-warning text-center'>
                {$txtError}
            </div>
          </div>";
}
?>