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
$slots_placa    = isset($_POST['slots_placa']) ? intval($_POST['slots_placa']) : 0;

$id_tamanio_filtro = isset($_POST['id_tamanio_mobo_case']) ? mysqli_real_escape_string($conexion, $_POST['id_tamanio_mobo_case']) : '0';

if ($cate_principal == 0 || $cate_padre == 0) {
    exit;
}

// Obtener nivel de asociacion
$sqlNivel = "SELECT tipo_asoc_padre FROM cate_asociado 
             WHERE cate_principal = $cate_principal AND cate_padre = $cate_padre AND compatibilidad = 1
             ORDER BY tipo_asoc_padre DESC LIMIT 1";
$resNivel = mysqli_query($conexion, $sqlNivel);

if (mysqli_num_rows($resNivel) == 0) {
    echo "<div class='col-12'><div class='alert alert-warning text-center'>No se encontraron componentes compatibles asociados para esta selección.</div></div>";
    exit;
}

$fila = mysqli_fetch_assoc($resNivel);
$tipo_asoc = $fila['tipo_asoc_padre'];

$sqlIds = "SELECT id_cat_asociado FROM cate_asociado 
           WHERE cate_principal = $cate_principal AND cate_padre = $cate_padre AND tipo_asoc_padre = $tipo_asoc AND compatibilidad = 1";
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

// Logica de filtro 
if ($cate_padre == 104 || $cate_padre == 105) {
    $condicionFiltro = "cp.id_category = $cate_padre AND p.tamano IN ($lista_ids)";
} elseif ($cate_padre == 101 && $slots_placa > 0) {
    $condicionFiltro = "cp.id_category IN ($lista_ids) AND p.slots_ram <= $slots_placa";
}
// Validacion para multiples tamaños
elseif ($cate_padre == 103) {
    if ($id_tamanio_filtro != '0' && $id_tamanio_filtro != '') {
        // Separar los tamaños si vienen múltiples 
        $tamanios_array = explode(',', $id_tamanio_filtro);
        $tamanios_array = array_map('trim', $tamanios_array); 
        
        // Construir condición con FIND_IN_SET para cada tamaño
        $condiciones_tamanio = [];
        foreach ($tamanios_array as $tamanio) {
            if (!empty($tamanio) && is_numeric($tamanio)) {
                $condiciones_tamanio[] = "FIND_IN_SET('$tamanio', p.id_tamanio_mobo_case)";
            }
        }
        
        if (!empty($condiciones_tamanio)) {
            $condicion_or = implode(' OR ', $condiciones_tamanio);
            $condicionFiltro = "cp.id_category IN ($lista_ids) AND ($condicion_or)";
        } else {
            $condicionFiltro = "1=0";
        }
    } else {
        $condicionFiltro = "1=0";
    }
} else {
    // Resto de componentes
    $condicionFiltro = "cp.id_category IN ($lista_ids)";
}

$sqlProd = "SELECT cp.id_product, cp.id_category, pl.name AS productoNombre, p.price, p.reference, 
                   p.slots, p.slots_ram, p.voltaje, p.cooler, p.gpu, p.socketCooler, p.id_tamanio_mobo_case,
                   cl.name AS nombreCategoria
            FROM ps_category_product cp
            INNER JOIN ps_product p ON cp.id_product = p.id_product
            INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
            INNER JOIN ps_category_lang cl ON cp.id_category = cl.id_category
            WHERE $condicionFiltro 
            AND p.active = 1 
            AND pl.id_lang = 2 
            AND cl.id_lang = 2 
            AND pl.name != ''";

$resProd = mysqli_query($conexion, $sqlProd);

if (mysqli_num_rows($resProd) > 0) {
    echo '<div class="row">';
    while ($prod = mysqli_fetch_assoc($resProd)) {
        $precioNormal = redondear_ajax($prod['price'] * 1.13);
        $precioEfectivo = redondear_ajax($precioNormal * $factorClass->getValor('FTJ')['valor']);
        $srcImg = pathImg_ajax($conexion, $prod['id_product']);

        $nombreProductoJS = str_replace(['"', "'"], '', $prod['productoNombre']);
        $nombreCategoriaJS = str_replace(['"', "'"], '', $prod['nombreCategoria']);

        $onclick = "agregarTabla(\"{$nombreProductoJS}\", {$precioNormal}, {$precioEfectivo}, 1, {$prod['id_product']}, {$prod['id_category']}, {$cate_padre}, \"{$nombreCategoriaJS}\", {$prod['slots']}, {$prod['slots_ram']}, {$prod['voltaje']}, {$prod['gpu']}, \"{$prod['id_tamanio_mobo_case']}\")";

        echo "<div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
        <div class='card mb-8 product-card' id='card-prod-{$prod['id_product']}'>
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
                   data-cate-principal='{$prod['id_category']}'
                   onclick='{$onclick}'>+ Agregar</a>
            </div>
        </div>
      </div>";
    }
    echo '</div>';
} else {
    echo "<div class='col-12'><div class='alert alert-warning text-center'>No se encontraron componentes compatibles asociados para esta selección.</div></div>";
}