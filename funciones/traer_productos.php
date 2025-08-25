<?php
include './conexion.php';

$cate_principal = intval($_POST['cate_principal']);
$cate_padre = intval($_POST['cate_padre']);

$sql = "SELECT * FROM cate_asociado 
        WHERE cate_principal = $cate_principal AND cate_padre = $cate_padre";
$res = mysqli_query($conexion, $sql);

$catAsociadoIds = [];

if (mysqli_num_rows($res) > 0) {
    // Traemos el mínimo tipo_asoc_padre
    $rowMin = mysqli_fetch_assoc(mysqli_query($conexion, 
        "SELECT MIN(tipo_asoc_padre) as minimo 
         FROM cate_asociado 
         WHERE cate_principal = $cate_principal AND cate_padre = $cate_padre"
    ));
    $minimo = $rowMin['minimo'];

    // Traemos todos los id_cat_asociado con ese mínimo
    $resAsoc = mysqli_query($conexion,
        "SELECT id_cat_asociado FROM cate_asociado 
         WHERE cate_principal = $cate_principal 
           AND cate_padre = $cate_padre 
           AND tipo_asoc_padre = $minimo"
    );

    while ($r = mysqli_fetch_assoc($resAsoc)) {
        $catAsociadoIds[] = $r['id_cat_asociado'];
    }
}

if (!empty($catAsociadoIds)) {
    $ids = implode(",", $catAsociadoIds);

    $queryProd = "SELECT cp.*, pl.name, pl.id_lang
                  FROM ps_category_product cp
                  INNER JOIN ps_product_lang pl ON cp.id_product = pl.id_product
                  INNER JOIN ps_product p ON cp.id_product = p.id_product
                  WHERE cp.id_category IN($ids) 
                    AND p.active = 1 
                    AND pl.name != '' 
                    AND pl.id_lang = 2";

    $resProd = mysqli_query($conexion, $queryProd);

    $productos = [];
    while ($p = mysqli_fetch_assoc($resProd)) {
        $productos[] = $p;
    }

    echo json_encode(["success" => true, "productos" => $productos]);
} else {
    echo json_encode(["success" => false, "productos" => []]);
}
