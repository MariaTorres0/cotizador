<?php
require "../funciones/conexion.php";
require '../funciones/factor_class.php';

$factorClass = new FactorClass();

function redondear_ajax($valor) {
    return number_format(round($valor * 100) / 100, 2, ".", "");
}

function preloadImageCache($conexion, $productIds = null)
{
    // Si ya se carg車 el cach谷 en esta ejecuci車n, no hacemos nada
    if (isset($GLOBALS['image_cache_loaded']) && $GLOBALS['image_cache_loaded']) {
        return;
    }

    // Buscar SOLO imagen principal: position = 1 y cover = 1
    $whereClause = "WHERE cover = 1"; 

    if ($productIds && is_array($productIds) && count($productIds) > 0) {
        $ids = implode(',', array_map('intval', $productIds));
        $whereClause .= " AND id_product IN ($ids)";
    }

    $sql = "SELECT id_product, id_image FROM ps_image $whereClause";
    $resultado = mysqli_query($conexion, $sql);

    if ($resultado) {
        while ($row = mysqli_fetch_assoc($resultado)) {
            $GLOBALS['image_cache'][$row['id_product']] = $row['id_image'];
        }
    }

    $GLOBALS['image_cache_loaded'] = true;
}

/**
 * Obtiene la ruta de la imagen usando el cach谷 si est芍 disponible.
 */
function pathImg_ajax($conexion, $idProducto)
{
    // 1. Intentar usar el cach谷 global primero
    if (isset($GLOBALS['image_cache'][$idProducto])) {
        return crearPath_ajax($GLOBALS['image_cache'][$idProducto]);
    }

    // 2. Buscar imagen principal en DB
    $sql = "SELECT id_image 
            FROM ps_image 
            WHERE id_product = $idProducto
              AND cover = 1
            LIMIT 1";

    $resultado = mysqli_query($conexion, $sql);
    
    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $filas = mysqli_fetch_array($resultado);
        $idImg = $filas[0];

        // Guardar en cach谷
        $GLOBALS['image_cache'][$idProducto] = $idImg;

        return crearPath_ajax($idImg);
    }

    // 3. Imagen por defecto
    return "https://kpchardware.com/img/logokpc.jpeg";
}

/**
 * Construye la URL de la imagen desglosando el ID en carpetas.
 */
function crearPath_ajax($nombreImg)
{
    // Si el ID es nulo, vac赤o o el viejo 1969, retornar el logo
    if (empty($nombreImg) || $nombreImg == "1969") {
        return "https://kpchardware.com/img/logokpc.jpeg";
    }

    $idSeparado = (string)$nombreImg;

    // Convertimos "123" en "1/2/3"
    $rutaId = implode("/", str_split($idSeparado));
    
    return "https://kpchardware.com/img/p/" . $rutaId . "/" . $nombreImg . ".jpg";
}

// Obtener datos POST
$wattsRequeridos = isset($_POST['watts']) ? floatval($_POST['watts']) : 0;
$catePrincipal = isset($_POST['id_cat_case']) ? intval($_POST['id_cat_case']) : 0; 
$catePadreFuentes = 109; 
$idIdioma = 2;

$filtroCategoriasCompatibles = "";

// Logica de asociacion
if ($catePrincipal > 0) {
    
    // Buscamos reglas de asociaci車n
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
        $txtError = "No se encontraron fuentes de {$wattsRequeridos}W compatibles con la categor赤a de gabinete seleccionada.";
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