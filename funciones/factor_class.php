<?php
require_once 'conexion.php';

class FactorClass
{
    public function getValor($codigoFac)
    {
        global $conexion;
        $sql = 'SELECT * FROM factor_precio WHERE codigo = "' . $codigoFac . '"';
        $res = mysqli_query($conexion, $sql);

        if (mysqli_num_rows($res) > 0) {
            return mysqli_fetch_assoc($res);
        } else {
            $datos = array(
                'codigo' => '',
                'descripcion' => 'No se encontró factor, usando 0.98 por defecto',
                'valor' => 0.98
            );
            return $datos;
        }
    }
}