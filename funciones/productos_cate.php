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
                La cantidad máxima de memorias RAM depende de los slots disponibles y de la capacidad soportada por la placa base seleccionada
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

    $sqlSub = "SELECT c.id_category, cl.name 
               FROM ps_category c 
               INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category 
               WHERE c.level_depth = 3 AND c.active = 1 AND cl.id_lang = 2 AND c.id_parent = $idCategoriaPadre 
               ORDER BY FIELD(UPPER(cl.name), 'INTEL', 'AMD') ASC";
    $resSub = mysqli_query($conexion, $sqlSub);

    $sIndex = 0;

    while ($sub = mysqli_fetch_assoc($resSub)) {
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

        // SUBSUBCATEGORÍAS
        $sqlSubSub = "SELECT c.id_category, cl.name 
                      FROM ps_category c 
                      INNER JOIN ps_category_lang cl ON c.id_category = cl.id_category 
                      WHERE c.level_depth = 4 AND c.active = 1 AND cl.id_lang = 2 AND c.id_parent = {$sub['id_category']} 
                      ORDER BY cl.name ASC";
        $resSubSub = mysqli_query($conexion, $sqlSubSub);
        $ssIndex = 0;

        while ($subsub = mysqli_fetch_assoc($resSubSub)) {
            $sqlProdCheck = "SELECT COUNT(*) as total 
                             FROM ps_category_product cp 
                             INNER JOIN ps_product p ON cp.id_product = p.id_product 
                             WHERE cp.id_category = {$subsub['id_category']} AND p.active = 1";
            $resProdCheck = mysqli_query($conexion, $sqlProdCheck);
            $prodCount = mysqli_fetch_assoc($resProdCheck)['total'];

            if ($prodCount > 0) {
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

                // PRODUCTOS
                $sqlProd = "SELECT cp.id_product, pl.name AS productoNombre, p.price, p.reference, p.slots, p.voltaje, p.cooler, p.gpu, p.socketCooler,
                                   cl.name AS nombreCategoria
                            FROM ps_category_product cp
                            INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
                            INNER JOIN ps_product p ON cp.id_product = p.id_product
                            INNER JOIN ps_category_lang cl ON cp.id_category = cl.id_category
                            WHERE cp.id_category = {$subsub['id_category']} AND p.active = 1 AND pl.id_lang = 2 AND cl.id_lang = 2";
                $resProd = mysqli_query($conexion, $sqlProd);

                while ($prod = mysqli_fetch_assoc($resProd)) {
                    $precioNormal = redondear($prod['price'] * 1.13);
                    $precioEfectivo = redondear($precioNormal * $factorClass->getValor('FTJ')['valor']);
                    $srcImg = pathImg($prod['id_product']);

                    $text = "";
                    if ($prod['cooler'] == 1 && $prod['gpu'] == 1) {
                        $text = "*Requiere cooler y GPU";
                    } else if ($prod['cooler'] == 1) {
                        $text = "*Requiere cooler";
                    } else if ($prod['gpu'] == 1) {
                        $text = "*Requiere GPU";
                    }

                    echo "<div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
                            <div class='card bg-light mb-8 product-card' id='card-prod-{$prod['id_product']}'>
                                
                                <div class='card-header p-1 text-center product-header' style='position: relative;'>
                                    
                                    <div class='check-overlay' style='display:none; position: absolute; top: 5px; right: 5px; z-index: 10;'>
                                        <i class='fas fa-check-circle' style='color: #28a745; font-size: 24px; background: white; border-radius: 50%;'></i>
                                    </div>

                                    <img src='{$srcImg}' style='max-width: 75px; max-height: 75px;' class='zoom mt-3'><br>
                                    <p>{$prod['productoNombre']} <br><b>{$text}</b></p>
                                </div>
                                
                                <div class='card-body p-2'>
                                    <p class='card-title font-weight-bold' style='color:#6D6D6B'>Precio normal: $ " . redondear($precioNormal) . "</p>
                                    <p class='card-title text-success font-weight-bold'>Precio efectivo: $ " . redondear($precioEfectivo) . "</p>
                                    
                                    <a class='btn btn-info btn-lg btn-block btn-agregar-producto' 
                                    style='color:#fff' 
                                    href='javascript:void(0)' 
                                    data-cate-principal='{$subsub['id_category']}'
                                    onclick='agregarTabla(\"{$prod['productoNombre']}\", " . redondear($precioNormal) . "," . redondear($precioEfectivo) . ", 1, {$prod['id_product']}, {$subsub['id_category']}, $idCategoriaPadre, \"{$prod['nombreCategoria']}\", {$prod['slots']}, {$prod['voltaje']}, {$prod['cooler']}, {$prod['gpu']}, \"{$prod['socketCooler']}\")'>
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
        $perifericosIds = [110, 111, 113];

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
    }
}

function mostrarProductosPorCategoria($idCategoria, $idCategoriaPadre, $tipo)
{
    global $conexion, $factorClass;

    $sqlProd = "SELECT cp.id_product, pl.name AS productoNombre, p.price, p.reference, p.slots,
                       p.voltaje, p.cooler, p.gpu, p.socketCooler,
                       cl.name AS nombreCategoria
                FROM ps_category_product cp
                INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
                INNER JOIN ps_product p ON cp.id_product = p.id_product
                INNER JOIN ps_category_lang cl ON cp.id_category = cl.id_category
                WHERE cp.id_category = {$idCategoria}
                  AND p.active = 1
                  AND pl.id_lang = 2
                  AND cl.id_lang = 2";

    $resProd = mysqli_query($conexion, $sqlProd);

    while ($prod = mysqli_fetch_assoc($resProd)) {

        $precioNormal   = redondear($prod['price'] * 1.13);
        $precioEfectivo = redondear($precioNormal * $factorClass->getValor('FTJ')['valor']);
        $srcImg         = pathImg($prod['id_product']);

        $nombreProductoJS  = str_replace(['"', "'"], '', $prod['productoNombre']);
        $nombreCategoriaJS = str_replace(['"', "'"], '', $prod['nombreCategoria']);

        $params = ["\"{$nombreProductoJS}\"", $precioNormal, $precioEfectivo, 1, $prod['id_product'], $idCategoria, $idCategoriaPadre, "\"{$nombreCategoriaJS}\"",  $prod['slots']];

        // Solo UPS y unidades reciben estos parámetros extra
        if (in_array($tipo, ['unidades', 'ups'])) {
            $params[] = $prod['voltaje'];
            $params[] = $prod['cooler'];
            $params[] = $prod['gpu'];
            $params[] = "\"{$prod['socketCooler']}\"";
        }

        $onclick = "agregarTabla(" . implode(',', $params) . ")";

        echo "
            <div class='col-lg-4 col-md-6 col-sm-12 mb-3'>
                <div class='card bg-light mb-8 product-card' id='card-prod-{$prod['id_product']}'>
                    
                    <div class='card-header p-1 text-center product-header' style='position: relative;'>
                    
                        <div class='check-overlay' style='display:none; position: absolute; top: 5px; right: 5px; z-index: 10;'>
                            <i class='fas fa-check-circle' style='color: #28a745; font-size: 24px; background: white; border-radius: 50%;'></i>
                        </div>
                        
                        <img src='{$srcImg}' style='max-width:75px; max-height:75px;' class='zoom mt-3'><br>
                        <p>{$prod['productoNombre']}</p>
                    </div>
                    
                    <div class='card-body p-2'>
                        <p class='card-title font-weight-bold' style='color:#6D6D6B'>
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
