<?php
/* $host = "localhost";
$user = "kpchardw_nwusr";
$nombreBD = "kpchardw_newsite";
$password = 'D3s@gJB^[y^S';

$conexion = mysqli_connect($host, $user, $password);
$acentos = mysqli_query($conexion, "SET NAMES 'utf-8'");
if (mysqli_connect_errno()) {
    echo "error de conexi܇n";
    exit();
}

mysqli_select_db($conexion, $nombreBD) or die("No se encuentra la base de datos.");

mysqli_set_charset($conexion, "utf8"); */

$host = "localhost";
$user = "root";
$nombreBD = "kpchardw_newsite";
$password = '';
$conexion = mysqli_connect($host, $user, $password);

if (mysqli_connect_errno()) {
    echo "error de conexión";
    exit();
}

mysqli_select_db($conexion, $nombreBD) or die("No se encuentra la base de datos.");

mysqli_query($conexion, "SET NAMES 'utf8mb4'");
mysqli_set_charset($conexion, "utf8mb4");

