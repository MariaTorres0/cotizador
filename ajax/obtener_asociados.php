<?php
require "../funciones/conexion.php";
require '../funciones/factor_class.php';

$factorClass = new FactorClass();

function redondear_ajax($valor)
{
    return number_format(round($valor * 100) / 100, 2, ".", "");
}

function pathImg_ajax($conexion, $idProducto)
{
    $sql = "SELECT id_image FROM ps_image WHERE ps_image.id_product = $idProducto";
    $resultado = mysqli_query($conexion, $sql);
    if (mysqli_num_rows($resultado) > 0) {
        $filas = mysqli_fetch_array($resultado);
        return crearPath_ajax($filas[0]);
    }
    return crearPath_ajax("1969");
}

function crearPath_ajax($nombreImg)
{
    $cadena = $nombreImg . ".jpg";
    $idSeparado = $nombreImg;
    $valorArray = array();
    for ($i = 0; $i < strlen($idSeparado); $i++) {
        array_push($valorArray, $idSeparado[$i]);
    }
    $rutaId = implode("/", $valorArray);
    return "https://kpchardware.com/img/p/" . $rutaId . "/" . $cadena;
}

$cate_principal = isset($_POST['cate_principal']) ? $_POST['cate_principal'] : 0;
$cate_padre     = isset($_POST['cate_padre']) ? $_POST['cate_padre'] : 0;

if ($cate_principal == 0 || $cate_padre == 0) {
    exit;
}

// Obtener el nivel de asociación
$sqlNivel = "SELECT tipo_asoc_padre FROM cate_asociado 
             WHERE cate_principal = $cate_principal AND cate_padre = $cate_padre 
             ORDER BY tipo_asoc_padre DESC LIMIT 1";
$resNivel = mysqli_query($conexion, $sqlNivel);

if (mysqli_num_rows($resNivel) == 0) {
    echo "<div class='col-12'><div class='alert alert-warning text-center'>No se encontraron componentes compatibles asociados para esta selección.</div></div>";
    exit;
}

$fila = mysqli_fetch_assoc($resNivel);
$tipo_asoc = $fila['tipo_asoc_padre'];

// Obtener los IDs de categorías permitidas
$sqlIds = "SELECT id_cat_asociado FROM cate_asociado 
           WHERE cate_principal = $cate_principal AND cate_padre = $cate_padre AND tipo_asoc_padre = $tipo_asoc";
$resIds = mysqli_query($conexion, $sqlIds);

$ids = [];
while ($row = mysqli_fetch_assoc($resIds)) {
    $ids[] = $row['id_cat_asociado'];
}
$lista_ids = implode(',', $ids);

if (empty($lista_ids)) {
    echo "<div class='col-12'><div class='alert alert-warning'>Configuración de asociaciones vacía.</div></div>";
    exit;
}

// Consultar productos
$sqlProd = "SELECT cp.id_product, cp.id_category, pl.name AS productoNombre, p.price, p.reference, p.slots, p.voltaje, p.cooler, p.gpu, p.socketCooler,
            cl.name AS nombreCategoria
            FROM ps_category_product cp
            INNER JOIN ps_product p ON cp.id_product = p.id_product
            INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
            INNER JOIN ps_category_lang cl ON cp.id_category = cl.id_category
            WHERE cp.id_category IN ($lista_ids) AND p.active = 1 AND pl.id_lang = 2 AND cl.id_lang = 2";

$resProd = mysqli_query($conexion, $sqlProd);

if (mysqli_num_rows($resProd) > 0) {
    echo '<div class="row">';
    while ($prod = mysqli_fetch_assoc($resProd)) {
        $precioNormal = redondear_ajax($prod['price'] * 1.13);
        $precioEfectivo = redondear_ajax($precioNormal * $factorClass->getValor('FTJ')['valor']);
        $srcImg = pathImg_ajax($conexion, $prod['id_product']);

        $nombreProductoJS = str_replace(['"', "'"], '', $prod['productoNombre']);
        $nombreCategoriaJS = str_replace(['"', "'"], '', $prod['nombreCategoria']);

        $onclick = "agregarTabla(\"{$nombreProductoJS}\", {$precioNormal}, {$precioEfectivo}, 1, {$prod['id_product']}, {$prod['id_category']}, {$cate_padre}, \"{$nombreCategoriaJS}\", 1, {$prod['voltaje']}, {$prod['cooler']}, {$prod['gpu']}, \"{$prod['socketCooler']}\")";

        echo "<div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
                <div class='card bg-light mb-8 product-card'>
                    <div class='card-header p-1 text-center product-header'>
                        <img src='{$srcImg}' style='max-width: 75px; max-height: 75px;' class='zoom mt-3'><br>
                        <p>{$prod['productoNombre']}</p>
                    </div>
                    <div class='card-body p-2'>
                        <p class='card-title font-weight-bold' style='color:#6D6D6B'>Precio normal: $ {$precioNormal}</p>
                        <p class='card-title text-success font-weight-bold'>Precio efectivo: $ {$precioEfectivo}</p>
                        
                        <a class='btn btn-info btn-lg btn-block btn-agregar-producto' 
                           style='color:#fff' 
                           href='javascript:void(0)' 
                           data-cate-principal='{$prod['id_category']}'
                           onclick='{$onclick}'>+ Añadir</a>
                    </div>
                </div>
              </div>";
    }
    echo '</div>';
} else {
    echo "<div class='col-12'><div class='alert alert-info text-center'>No hay stock disponible para las categorías compatibles seleccionadas.</div></div>";
}
