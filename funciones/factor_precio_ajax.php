<?php
require 'conexion.php';

$codigoFac = $_POST['codigo'];
global $conexion;

$sql = 'SELECT * FROM factor_precio WHERE codigo = "' . $codigoFac . '"';
$res = mysqli_query($conexion, $sql);

header('Content-Type: application/json');

if(mysqli_num_rows($res)>0){
    echo json_encode(mysqli_fetch_assoc($res));
}else{
    $datos = array(
        'codigo' => '',
        'descripcion' => 'No se encontró factor, usando 0.98 por defecto',
        'valor' => 0.98
    );
    echo json_encode($datos);
}