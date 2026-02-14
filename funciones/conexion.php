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

// Usar conexión persistente para mejor rendimiento (comentar si causa problemas)
// $conexion = mysqli_connect("p:" . $host, $user, $password);
$conexion = mysqli_connect($host, $user, $password);

if (mysqli_connect_errno()) {
    echo "error de conexión";
    exit();
}

mysqli_select_db($conexion, $nombreBD) or die("No se encuentra la base de datos.");

// Configurar charset
mysqli_query($conexion, "SET NAMES 'utf8mb4'");
mysqli_set_charset($conexion, "utf8mb4");

// Optimizaciones de MySQL para mejor rendimiento
mysqli_query($conexion, "SET SESSION query_cache_type = ON");
mysqli_query($conexion, "SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");

