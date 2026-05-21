<?php
require_once 'factor_class.php';
$factorClass = new FactorClass();

// Caché global de imágenes para evitar queries repetidas
$GLOBALS['image_cache'] = [];
$GLOBALS['image_cache_loaded'] = false;

function redondear($valor)
{
    $float_redondeado = round($valor * 100) / 100;
    $float_redondeado = number_format($float_redondeado, 2, ".", "");
    return $float_redondeado;
}

// Cargar todas las imágenes de productos en una sola query
function preloadImageCache($productIds = null)
{
    global $conexion;

    if (isset($GLOBALS['image_cache_loaded']) && $GLOBALS['image_cache_loaded']) {
        return;
    }

    // Filtramos por position = 1 Y cover = 1
    $whereClause = "WHERE cover = 1";

    if ($productIds && is_array($productIds) && count($productIds) > 0) {
        $ids = implode(',', array_map('intval', $productIds));
        $whereClause .= " AND id_product IN ($ids)";
    }

    $sql = "SELECT id_product, id_image FROM ps_image $whereClause";
    $resultado = mysqli_query($conexion, $sql);

    if ($resultado) {
        while ($row = mysqli_fetch_assoc($resultado)) {
            // Guardamos la imagen principal en el caché
            $GLOBALS['image_cache'][$row['id_product']] = $row['id_image'];
        }
    }

    $GLOBALS['image_cache_loaded'] = true;
}

function pathImg($idProducto)
{
    // 1. Intentar usar el caché
    if (isset($GLOBALS['image_cache'][$idProducto])) {
        return crearPath($GLOBALS['image_cache'][$idProducto]);
    }

    global $conexion;

    // 2. Buscar imagen con position = 1 Y cover = 1
    $sql = "SELECT id_image 
            FROM ps_image 
            WHERE id_product = $idProducto 
              AND cover = 1 
            LIMIT 1";

    $resultado = mysqli_query($conexion, $sql);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $filas = mysqli_fetch_array($resultado);
        $idImg = $filas[0];

        $GLOBALS['image_cache'][$idProducto] = $idImg;

        return crearPath($idImg);
    }

    // 3. Imagen por defecto
    return "https://kpchardware.com/img/logokpc.jpeg";
}

function crearPath($nombreImg)
{
    if (!$nombreImg) {
        return "https://kpchardware.com/img/logokpc.jpeg";
    }

    $cadena = $nombreImg . ".jpg";
    $idSeparado = (string)$nombreImg;
    $valorArray = str_split($idSeparado);

    $rutaId = implode("/", $valorArray);

    return "https://kpchardware.com/img/p/" . $rutaId . "/" . $cadena;
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

$perifericos_ids = [189, 110, 111, 113, 153, 152, 112];


function mostrarCategoria($categoria, $index, $show = false, $color = '#565652', $showIcon = true, $parentId = '#accordionExample')
{
    $btnId = $categoria['id_btn'] ?? "btn{$index}";
    $collapseId = "collapse{$index}";
    $headingId = "heading{$index}";
    $bodyId = $categoria['nombre'] . 'Body';
    $expanded = $show ? 'true' : 'false';
    $collapseClass = $show ? 'collapse show' : 'collapse';
    $btnCollapsed = $show ? '' : 'collapsed';

    $catId = isset($categoria['id_category']) ? $categoria['id_category'] : $index;

    echo "<div class='card' id='cat-{$catId}'>
            <div class='card-header degradadoGris' id='{$headingId}'>
                <h2 class='mb-0 text-left d-flex align-items-center flex-wrap'>";

    echo "<button class='btn btn-link {$btnCollapsed}'
                id='{$btnId}Btn'
                style='color: {$color};'
                type='button'
                data-target='#{$collapseId}'
                aria-expanded='{$expanded}'
                aria-controls='{$collapseId}'
                data-cat-id='{$catId}'>";

    if ($showIcon) {
        $iconColor = ($categoria['obligatorio'] ?? 0) == 1 ? 'red' : '';
        $iconClass = ($categoria['obligatorio'] ?? 0) == 1 ? 'fas fa-times' : 'fas fa-exclamation';

        echo "<img src='iconos_cat/{$categoria['icono']}'
                    width='40' height='40'
                    style='vertical-align: middle; margin-right: 8px;' />";

        echo "<span>{$categoria['nombre']}</span>";

        echo "<i class='{$iconClass}' id='{$catId}'
                    style='color: {$iconColor}; margin-left: 6px;'></i>";
    } else {
        echo $categoria['nombre'];
    }

    echo "</button>";

    /* ===== AVISOS DESKTOP ===== */
    if ($catId == 101) {
        echo "<div id='ram-live-container' class='ram-counter-box d-none d-sm-inline-flex'>
            <span class='ram-counter-text'>Slots: 0 / 0</span>
            <div class='ram-indicators-container'>
                </div>
          </div>";
        echo "<span class='fuente-hint ml-md-3 d-none d-md-inline'>
                La cantidad máxima de memorias RAM depende de los slots disponibles en la placa base seleccionada
              </span>";
    } else if ($catId == 109) {
        echo "<span class='fuente-hint ml-md-2 d-none d-md-inline'>
                Las fuentes se sugieren según el consumo de los componentes seleccionados
              </span>";
    }

    /* ===== AVISOS SOLO MÓVIL (debajo del nombre) ===== */
    if ($catId == 101) {
        echo "<div class='fuente-hint w-100 mt-1 d-block d-md-none'>
                La cantidad máxima de memorias RAM depende de los slots disponibles en la placa base seleccionada
              </div>";
    } else if ($catId == 109) {
        echo "<div class='fuente-hint w-100 mt-1 d-block d-md-none'>
                Las fuentes se sugieren según el consumo de los componentes seleccionados
              </div>";
    }

    echo "      </h2>
            </div>
            <div id='{$collapseId}' class='{$collapseClass}'
                aria-labelledby='{$headingId}'
                data-parent='{$parentId}'>
                <div class='card-body' id='{$bodyId}'></div>
            </div>
        </div>";
}

function mostrarProce($idCategoriaPadre = 100, $parentId = '#accordionCPU')
{
    global $conexion, $factorClass;

    // OPTIMIZACIÓN: Obtener todas las subcategorías y subsubcategorías con conteo de productos en menos queries
    $sqlSub = "SELECT c.id_category, cl.name,
                   (SELECT COUNT(DISTINCT cp2.id_product)
                    FROM ps_category c2
                    INNER JOIN ps_category_product cp2 ON c2.id_category = cp2.id_category
                    INNER JOIN ps_product p2 ON cp2.id_product = p2.id_product
                    WHERE c2.id_parent = c.id_category AND c2.active = 1 AND p2.active = 1) as total_productos
               FROM ps_category c 
               INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category 
               WHERE c.level_depth = 3 AND c.active = 1 AND cl.id_lang = 2 AND c.id_parent = $idCategoriaPadre 
               ORDER BY FIELD(UPPER(cl.name), 'INTEL', 'AMD') ASC";
    $resSub = mysqli_query($conexion, $sqlSub);

    $sIndex = 0;
    $allProductIds = [];

    while ($sub = mysqli_fetch_assoc($resSub)) {
        // Saltar si no hay productos
        if ($sub['total_productos'] == 0) {
            continue;
        }

        $sIndex++;
        $collapseSub = "collapseSub{$sIndex}";
        $headingSub = "headingSub{$sIndex}";
        $subId = $sub['id_category'];

        echo "<div class='card' id='cat-{$subId}'>
                <div class='card-header' id='{$headingSub}'>
                    <h2 class='mb-0 text-left'>
                        <button class='btn btn-link collapsed' id='btnSub{$subId}'  type='button' data-target='#{$collapseSub}' aria-expanded='false' aria-controls='{$collapseSub}' style='color:#007bff;' data-cat-id='{$subId}'>
                            " . strtoupper($sub['name']) . "
                        </button>
                    </h2>
                </div>
                <div id='{$collapseSub}' class='collapse' aria-labelledby='{$headingSub}' data-parent='{$parentId}'>
                    <div class='card-body'>
                        <div class='accordion' id='accordionSub{$sIndex}'>";

        // OPTIMIZACIÓN: Obtener subsubcategorías con conteo de productos
        $sqlSubSub = "SELECT c.id_category, cl.name,
                          (SELECT COUNT(*) FROM ps_category_product cp2 
                           INNER JOIN ps_product p2 ON cp2.id_product = p2.id_product 
                           WHERE cp2.id_category = c.id_category AND p2.active = 1) as prod_count
                      FROM ps_category c 
                      INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category 
                      WHERE c.level_depth = 4 AND c.active = 1 AND cl.id_lang = 2 AND c.id_parent = {$sub['id_category']} 
                      HAVING prod_count > 0
                      ORDER BY cl.name ASC";
        $resSubSub = mysqli_query($conexion, $sqlSubSub);
        $ssIndex = 0;

        while ($subsub = mysqli_fetch_assoc($resSubSub)) {
            $prodCount = $subsub['prod_count'];

            $ssIndex++;
            $collapseSubSub = "collapseSubSub{$sIndex}{$ssIndex}";
            $headingSubSub = "headingSubSub{$sIndex}{$ssIndex}";
            $subsubId = $subsub['id_category'];

            echo "<div class='card' id='cat-{$subsubId}'>
                    <div class='card-header' id='{$headingSubSub}'>
                        <h2 class='mb-0'>
                            <button class='btn btn-link collapsed' id='btnSubSub{$subsubId}' data-level='subsub' type='button' data-target='#{$collapseSubSub}' aria-expanded='false' aria-controls='{$collapseSubSub}' style='color:#007bff;' data-cat-id='{$subsubId}'>
                                {$subsub['name']}
                            </button>
                        </h2>
                    </div>
                    <div id='{$collapseSubSub}' class='collapse' aria-labelledby='{$headingSubSub}' data-parent='#accordionSub{$sIndex}'>
                        <div class='card-body'>
                            <div class='row'>";

            // OPTIMIZACIÓN: Obtener productos con su imagen en una sola query
            $sqlProd = "SELECT cp.id_product, pl.name AS productoNombre, p.price, p.reference, 
                               p.slots, p.slots_ram, p.voltaje, p.cooler, p.gpu, p.socketCooler,
                               cl.name AS nombreCategoria,
                               (SELECT pi.id_image FROM ps_image pi WHERE pi.id_product = cp.id_product LIMIT 1) as id_image
                        FROM ps_category_product cp
                        INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
                        INNER JOIN ps_product p ON cp.id_product = p.id_product
                        INNER JOIN ps_category_lang cl ON cp.id_category = cl.id_category
                        WHERE cp.id_category = {$subsub['id_category']} AND p.active = 1 AND pl.id_lang = 2 AND cl.id_lang = 2 ORDER BY p.price ASC";
            $resProd = mysqli_query($conexion, $sqlProd);

            while ($prod = mysqli_fetch_assoc($resProd)) {
                $precioNormal = redondear($prod['price'] * 1.13);
                $precioEfectivo = redondear($precioNormal * $factorClass->getValor('FTJ')['valor']);

                // Usar imagen de la query o default
                $srcImg = $prod['id_image'] ? crearPath($prod['id_image']) : "https://kpchardware.com/img/logokpc.jpeg";

                $text = "";
                if ($prod['cooler'] == 1 && $prod['gpu'] == 1) {
                    $text = "*Requiere cooler y GPU";
                } else if ($prod['cooler'] == 1) {
                    $text = "*Requiere cooler";
                } else if ($prod['gpu'] == 1) {
                    $text = "*Requiere GPU";
                }

                $nombreProductoJS = str_replace(['"', "'"], '', $prod['productoNombre']);
                $nombreCategoriaJS = str_replace(['"', "'"], '', $prod['nombreCategoria']);

                echo "<div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
                        <div class='card mb-8 product-card' id='card-prod-{$prod['id_product']}'>
                            
                            <div class='card-header p-1 text-center product-header' style='position: relative;'>
                                
                                <div class='check-overlay' style='display:none; position: absolute; top: 5px; right: 5px; z-index: 10;'>
                                    <i class='fas fa-check-circle' style='color: #28a745; font-size: 24px; background: white; border-radius: 50%;'></i>
                                </div>

                                <img src='{$srcImg}' style='max-width: 75px; max-height: 75px;' class='zoom mt-3' loading='lazy'><br>
                                <p>{$prod['productoNombre']} <br><b>{$text}</b></p>
                            </div>
                            
                            <div class='card-body p-2'>
                                <p class='card-title font-weight-bold'>Precio normal: $ {$precioNormal}</p>
                                <p class='card-title text-success font-weight-bold'>Precio efectivo: $ {$precioEfectivo}</p>
                                
                                <a class='btn btn-info btn-lg btn-block btn-agregar-producto' 
                                style='color:#fff' 
                                href='javascript:void(0)' 
                                data-cate-principal='{$subsub['id_category']}'
                                onclick='agregarTabla(\"{$nombreProductoJS}\", {$precioNormal}, {$precioEfectivo}, 1, {$prod['id_product']}, {$subsub['id_category']}, $idCategoriaPadre, \"{$nombreCategoriaJS}\", {$prod['slots']}, {$prod['slots_ram']}, {$prod['voltaje']}, {$prod['gpu']}, \"{$prod['socketCooler']}\", {$prod['cooler']})'>
                                + Agregar
                                </a>
                            </div>
                        </div>
                    </div>";
            }

            echo "      </div>
                    </div>
                </div>
              </div>";
        }

        echo "      </div>
                </div>
              </div>
            </div>";
    }
}

function mostrarProductos($tipo = 'unidades', $idCategoriaPadre = null, $parentId = null)
{
    global $conexion;

    $sIndex = 0;

    if ($tipo === 'unidades') {
        $parentId = $parentId ?? '#accordionUnidadesDatos';
        $idCategoriaPadre = $idCategoriaPadre ?? 118;

        $sqlSub = "SELECT c.id_category, cl.name
                   FROM ps_category c
                   INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category
                   WHERE c.level_depth = 3 
                     AND c.active = 1 
                     AND cl.id_lang = 2 
                     AND c.id_parent = $idCategoriaPadre
                     AND c.id_category NOT IN (183, 178)
                   ORDER BY cl.name ASC";
        $resSub = mysqli_query($conexion, $sqlSub);

        while ($sub = mysqli_fetch_assoc($resSub)) {
            // Verificar si hay productos activos
            $sqlProdCheck = "SELECT COUNT(*) as total 
                             FROM ps_category_product cp 
                             INNER JOIN ps_product p ON cp.id_product = p.id_product 
                             WHERE cp.id_category = {$sub['id_category']} AND p.active = 1";
            $prodCount = mysqli_fetch_assoc(mysqli_query($conexion, $sqlProdCheck))['total'];

            if ($prodCount > 0) {
                $sIndex++;
                $collapseSub = "collapseUnitSub{$sIndex}";
                $headingSub = "headingUnitSub{$sIndex}";
                $subId = $sub['id_category'];

                echo "<div class='card' id='cat-{$subId}'>
                        <div class='card-header' id='{$headingSub}'>
                            <h2 class='mb-0 text-left'>
                                <button class='btn btn-link collapsed' id='btnUnitSub{$subId}' type='button' data-toggle='collapse' data-target='#{$collapseSub}' aria-expanded='false' aria-controls='{$collapseSub}' style='color:#007bff;' data-cat-id='{$subId}'>
                                    " . strtoupper($sub['name']) . "
                                </button>
                            </h2>
                        </div>
                        <div id='{$collapseSub}' class='collapse' aria-labelledby='{$headingSub}' data-parent='{$parentId}'>
                            <div class='card-body'>
                                <div class='row'>";
                mostrarProductosPorCategoria($sub['id_category'], $idCategoriaPadre, $tipo);
                echo "      </div>
                            </div>
                        </div>
                      </div>";
            }
        }
    } elseif ($tipo === 'perifericos') {
        $parentId = $parentId ?? '#accordionPerifericos';
        $perifericosIds = [189, 110, 111, 113, 153, 152, 112];

        foreach ($perifericosIds as $catId) {
            $sqlCat = "SELECT c.id_category, cl.name 
                       FROM ps_category c
                       INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category
                       WHERE c.id_category = $catId AND cl.id_lang = 2";
            $cat = mysqli_fetch_assoc(mysqli_query($conexion, $sqlCat));

            $sqlCheck = "SELECT COUNT(*) AS total 
                         FROM ps_category_product cp
                         INNER JOIN ps_product p ON cp.id_product = p.id_product
                         WHERE cp.id_category = {$cat['id_category']} AND p.active = 1";
            $totalProd = mysqli_fetch_assoc(mysqli_query($conexion, $sqlCheck))['total'];

            if ($totalProd > 0) {
                $sIndex++;
                $collapseSub = "collapsePeri{$sIndex}";
                $headingSub = "headingPeri{$sIndex}";
                $subId = $cat['id_category'];

                echo "<div class='card' id='cat-{$subId}'>
                        <div class='card-header text-left' id='{$headingSub}'>
                            <h2 class='mb-0'>
                                <button class='btn btn-link collapsed' id='btnSub{$subId}' type='button' data-target='#{$collapseSub}' aria-expanded='false' aria-controls='{$collapseSub}' style='color:#007bff;' data-cat-id='{$subId}'>
                                    " . strtoupper($cat['name']) . "
                                </button>
                            </h2>
                        </div>
                        <div id='{$collapseSub}' class='collapse' aria-labelledby='{$headingSub}' data-parent='{$parentId}'>
                            <div class='card-body'>
                                <div class='row'>";
                mostrarProductosPorCategoria($cat['id_category'], $idCategoriaPadre, $tipo);
                echo "      </div>
                            </div>
                        </div>
                      </div>";
            }
        }
    } elseif ($tipo === 'monitores') {
        $parentId = $parentId ?? '#accordionMonitores';
        $idCategoriaPadre = $idCategoriaPadre ?? 119;

        $sqlSub = "SELECT c.id_category, cl.name, COUNT(p.id_product) AS totalProductos
                   FROM ps_category c
                   INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category
                   INNER JOIN ps_category_product cp ON cp.id_category = c.id_category
                   INNER JOIN ps_product p ON cp.id_product = p.id_product AND p.active = 1
                   WHERE c.level_depth = 3 AND c.active = 1 AND cl.id_lang = 2 AND c.id_parent = $idCategoriaPadre
                   GROUP BY c.id_category
                   HAVING totalProductos > 0
                   ORDER BY cl.name ASC";
        $resSub = mysqli_query($conexion, $sqlSub);

        while ($sub = mysqli_fetch_assoc($resSub)) {
            $sIndex++;
            $collapseSub = "collapseMonSub{$sIndex}";
            $headingSub = "headingMonSub{$sIndex}";
            $subId = $sub['id_category'];

            echo "<div class='card' id='cat-{$subId}'>
                    <div class='card-header' id='{$headingSub}'>
                        <h2 class='mb-0 text-left'>
                            <button class='btn btn-link collapsed' id='btnSub{$subId}' type='button' data-target='#{$collapseSub}' aria-expanded='false' aria-controls='{$collapseSub}' style='color:#007bff;' data-cat-id='{$subId}'>
                                " . strtoupper($sub['name']) . "
                            </button>
                        </h2>
                    </div>
                    <div id='{$collapseSub}' class='collapse' aria-labelledby='{$headingSub}' data-parent='{$parentId}'>
                        <div class='card-body'>
                            <div class='row'>";
            mostrarProductosPorCategoria($sub['id_category'], $idCategoriaPadre, $tipo);
            echo "      </div>
                        </div>
                    </div>
                  </div>";
        }
    } elseif ($tipo === 'ups') {
        $parentId = $parentId ?? '#accordionUPS';
        $idCategoria = $idCategoriaPadre ?? 122;

        echo "<div class='row'>";
        mostrarProductosPorCategoria($idCategoria, $idCategoria, $tipo);
        echo "</div>";
    } elseif ($tipo === 'ventiladores') {
        $parentId = $parentId ?? '#accordionVentiladores';
        $idCategoriaPadre = $idCategoriaPadre ?? 106;

        $sqlSub = "SELECT c.id_category, cl.name, COUNT(p.id_product) AS totalProductos
                   FROM ps_category c
                   INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category
                   INNER JOIN ps_category_product cp ON cp.id_category = c.id_category
                   INNER JOIN ps_product p ON cp.id_product = p.id_product AND p.active = 1
                   WHERE c.id_parent = $idCategoriaPadre AND c.active = 1 AND cl.id_lang = 2
                   GROUP BY c.id_category
                   HAVING totalProductos > 0
                   ORDER BY cl.name ASC";
        $resSub = mysqli_query($conexion, $sqlSub);

        while ($sub = mysqli_fetch_assoc($resSub)) {
            $sIndex++;
            $collapseSub = "collapse" . ucfirst($tipo) . "Sub{$sIndex}";
            $headingSub = "heading" . ucfirst($tipo) . "Sub{$sIndex}";
            $subId = $sub['id_category'];

            echo "<div class='card' id='cat-{$subId}'>
                    <div class='card-header' id='{$headingSub}'>
                        <h2 class='mb-0 text-left'>
                            <button class='btn btn-link collapsed' id='btnSub{$subId}' type='button' data-target='#{$collapseSub}' aria-expanded='false' aria-controls='{$collapseSub}' style='color:#007bff;' data-cat-id='{$subId}'>
                                " . strtoupper($sub['name']) . "
                            </button>
                        </h2>
                    </div>
                    <div id='{$collapseSub}' class='collapse' aria-labelledby='{$headingSub}' data-parent='{$parentId}'>
                        <div class='card-body'>
                            <div class='row'>";
            mostrarProductosPorCategoria($sub['id_category'], $idCategoriaPadre, $tipo);
            echo "      </div>
                        </div>
                    </div>
                  </div>";
        }
    } elseif ($tipo === 'muebles') {
        $parentId = $parentId ?? '#accordionMuebles';
        $idCategoria = $idCategoriaPadre ?? 121;

        echo "<div class='row'>";
        mostrarProductosPorCategoria($idCategoria, $idCategoria, $tipo);
        echo "</div>";
    }
}

function mostrarProductosPorCategoria($idCategoria, $idCategoriaPadre, $tipo)
{
    global $conexion, $factorClass;

    // OPTIMIZACIÓN: Obtener productos con imagen en una sola query
    $sqlProd = "SELECT cp.id_product, pl.name AS productoNombre, p.price, p.reference, p.slots,
                       p.slots_ram, p.voltaje, p.cooler, p.gpu, p.socketCooler,
                       cl.name AS nombreCategoria,
                       (SELECT pi.id_image FROM ps_image pi WHERE pi.id_product = cp.id_product LIMIT 1) as id_image
                FROM ps_category_product cp
                INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
                INNER JOIN ps_product p ON cp.id_product = p.id_product
                INNER JOIN ps_category_lang cl ON cp.id_category = cl.id_category
                WHERE cp.id_category = {$idCategoria}
                  AND p.active = 1
                  AND pl.id_lang = 2
                  AND cl.id_lang = 2
                ORDER BY p.price ASC";

    $resProd = mysqli_query($conexion, $sqlProd);

    while ($prod = mysqli_fetch_assoc($resProd)) {

        $precioNormal   = redondear($prod['price'] * 1.13);
        $precioEfectivo = redondear($precioNormal * $factorClass->getValor('FTJ')['valor']);

        // Usar imagen de la query o default
        $srcImg = $prod['id_image'] ? crearPath($prod['id_image']) : "https://kpchardware.com/img/logokpc.jpeg";

        $nombreProductoJS  = str_replace(['"', "'"], '', $prod['productoNombre']);
        $nombreCategoriaJS = str_replace(['"', "'"], '', $prod['nombreCategoria']);

        $params = [
            "\"{$nombreProductoJS}\"",
            $precioNormal,
            $precioEfectivo,
            1,
            $prod['id_product'],
            $idCategoria,
            $idCategoriaPadre,
            "\"{$nombreCategoriaJS}\"",
            $prod['slots'],
            $prod['slots_ram'] ?? 0,
            $prod['voltaje'] ?? 0,
            $prod['gpu'] ?? 0,
            "\"{$prod['socketCooler']}\"",
            $prod['cooler'] ?? 0
        ];

        $onclick = "agregarTabla(" . implode(',', $params) . ")";

        echo "
            <div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
                <div class='card mb-8 product-card' id='card-prod-{$prod['id_product']}'>
                    
                    <div class='card-header p-1 text-center product-header' style='position: relative;'>
                    
                        <div class='check-overlay' style='display:none; position: absolute; top: 5px; right: 5px; z-index: 10;'>
                            <i class='fas fa-check-circle' style='color: #28a745; font-size: 24px; background: white; border-radius: 50%;'></i>
                        </div>
                        
                        <img src='{$srcImg}' style='max-width:75px; max-height:75px;' class='zoom mt-3' loading='lazy'><br>
                        <p>{$prod['productoNombre']}</p>
                    </div>
                    
                    <div class='card-body p-2'>
                        <p class='card-title font-weight-bold'>
                            Precio normal: $ {$precioNormal}
                        </p>
                        <p class='card-title text-success font-weight-bold'>
                            Precio efectivo: $ {$precioEfectivo}
                        </p>
                        <a class='btn btn-info btn-lg btn-block btn-agregar-producto'
                        style='color:#fff'
                        href='javascript:void(0)'
                        data-cate-principal='{$idCategoria}'
                        onclick='{$onclick}'>
                        + Agregar
                        </a>
                    </div>
                </div>
            </div>";
    }
}

function mostrarCardProducto($tipo, $categoriaNombre, $categoriaId = null, $parentAccordion, $icono = null, $id_btn = null, $obligatorio = 0)
{

    $btnId = $id_btn ?? "btn{$tipo}";
    $headingId = "heading" . ucfirst($tipo);
    $collapseId = "collapse" . ucfirst($tipo);
    $accordionInternoId = "accordion" . ucfirst($tipo) . "Interno";
    $iconoPath = $icono ? "iconos_cat/$icono" : "iconos_cat/$tipo.png";

    $iconClass = ($obligatorio == 1) ? 'fas fa-times' : 'fas fa-exclamation';
    $iconColor = ($obligatorio == 1) ? 'red' : '';

    echo "<div class='card'>
            <div class='card-header degradadoGris' id='{$headingId}'>
                <h2 class='mb-0 text-left'>
                    <button class='btn btn-link collapsed'
                            id='{$btnId}Btn'
                            style='color: #565652;'
                            type='button'
                            data-target='#{$collapseId}'
                            aria-expanded='false'
                            aria-controls='{$collapseId}'
                            data-parent='{$parentAccordion}'
                            data-cat-id='{$categoriaId}'>
                        <img src='{$iconoPath}' width='40' height='40'
                             style='vertical-align: middle; margin-right: 6px;' alt='{$categoriaNombre}' />
                        <span>{$categoriaNombre}</span>
                        <i class='{$iconClass}' id='{$categoriaId}' style='color: {$iconColor}; margin-left: 6px;'></i>
                    </button>
                </h2>
            </div>
            <div id='{$collapseId}' class='collapse' aria-labelledby='{$headingId}' data-parent='{$parentAccordion}'>
                <div class='card-body'>
                    <div class='accordion' id='{$accordionInternoId}'>";

    mostrarProductos($tipo, $categoriaId, "#{$accordionInternoId}");

    echo "      </div>
                </div>
            </div>
          </div>";
}
