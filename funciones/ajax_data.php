<?php

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
    $filas = mysqli_fetch_array($resultado);

    return crearPath($filas[0]);
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

$nombreCate = $_POST["categoriaProc"];

if (empty($_POST['categoriaProc'])) {

    echo "<div class='alert-danger'>Debe seleccionar los componentes en el orden de los botones.</div>";

} else {
    require_once 'factor_class.php';

    $factorClass = new FactorClass();

#Conectare a la base de datos
    include("./conexion.php");
    $query = "SELECT ps_category_product.id_category AS categoria, ps_category_lang.name 
                as nombreCategoria, ps_product_lang.name as productoNombre, ps_product_lang.id_product, ps_product.price, ps_product.slots, ps_product.cooler, ps_product.gpu 
                FROM ps_category_product, ps_product_lang, ps_category_lang, ps_product WHERE ps_category_lang.name = '$nombreCate'  
                AND ps_product.id_category_default = 99 
                AND ps_category_product.id_category = ps_category_lang.id_category && ps_category_product.id_product = ps_product_lang.id_product && ps_product.id_product = ps_category_product.id_product 
                AND ps_product.active = 1 
                AND ps_product_lang.id_lang=2 AND ps_category_lang.id_lang=2
                ORDER BY ps_product.price ASC";

    $sql = $conexion->query($query) or die(mysqli_error());

    $numRows = $sql->num_rows;
    if ($numRows > 0) {
        echo "<div class='card-body m-0 p-0 p-lg-2'><div class='row align-items-start'>";
        while ($f_prod = $sql->fetch_array()) {
            $nombreProd = $f_prod["productoNombre"];
            $idProd = $f_prod["id_product"];
            $precioNormal = redondear($f_prod["price"] * 1.13);
            $precioEfectivo = redondear($precioNormal * $factorClass->getValor('FTJ')['valor']);
            $idProducto = $f_prod["id_product"];
            $cate = $f_prod["nombreCategoria"];
            $idCategoria = $f_prod["categoria"];
            $nombreCategoria = $f_prod["nombreCategoria"];
            $cooler = $f_prod["cooler"];
            $slots = $f_prod["slots"];
            $gpuNece = $f_prod["gpu"];

            $srcImg = pathImg($idProd);

            echo "<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12' >
                <div class='card bg-light mb-3' style='max-width: 18rem;'>
                    <div class='card-header p-1'>
                        <img src='$srcImg' style='max-height: 75px; max-width: 75px;' class='zoom'>
                        <p>$nombreProd</p>
                    </div>
                    <div class='card-body p-1 col-12'>
                        <p class='card-title font-weight-bold' style='color:#6D6D6B'>Precio normal: $ " . $precioNormal . "</p>
                        <p class='card-title text-success font-weight-bold'>Precio efectivo: $ " . $precioEfectivo . "</p>
                        <a class='btn btn-info btn-lg btn-block' style='color: #fff' href='javascript:void(0)' onclick='agregarTabla(\"$nombreProd\", $precioNormal, $precioEfectivo, 1, $idProducto, $idCategoria, 99, \"$nombreCategoria\",$slots, 1, $cooler,$gpuNece, 0)'>+ Añadir</a>
                    </div>
                </div>
            </div>";
            ?>
            <?php

        }
        echo '</div>';
    } else {
        echo "<div class='alert-danger'>No hay productos compatibles en stock.</div>";
    }
}
?>