<?php
require './funciones/conexion.php';
require './funciones/productos_cate.php';
?>
<html>
<head>
    
    
    
    <meta charset="UTF-8">
    <title>Cotiza tu KPC</title>
    <link rel="icon" type="image/png" href="img/icons/icon.ico"/>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>

    <!-- Popper JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>

    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <link href="css/styles.css" rel="stylesheet" type="text/css"/>
    <link href="js/css/alertify.min.css" rel="stylesheet" type="text/css"/>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <script src="js/jquery-3.4.1.min.js" type="text/javascript"></script>
    <meta property="og:url" content="https://www.kpchardware.com/personalizacion"/>
    <meta property="og:type" content="article"/>
    <meta property="og:title" content="Cotiza tu KPC"/>
    <meta property="og:description" content="Realiza tu cotización online con KPC Hardware"/>
    <meta property="og:image" content="https://www.kpchardware.com/personalizacion/img/fb_shares.jpg"/>
    <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.7.2/css/all.css'
          integrity='sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr' crossorigin='anonymous'>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>

    <style>
        .alertify-notifier .ajs-message.ajs-error {
            color: #fff;
        }

        .alertify-notifier .ajs-message.ajs-success {
            color: #fff;
        }
    </style>
</head>
<body>
<form action="funciones/enviar.php" method="POST" target="_blank">
    <div class="container first container-first">
        <a href="https://www.kpchardware.com" target="_blank">
            <img src="img/5.png" class="img-fluid logo" alt="Responsive image">
        </a>
    </div>
    <input type="hidden" id="catProce">
    <input type="hidden" id="catMobo">
    <input type="hidden" id="idMobo">
    <input type="hidden" id="idCase">
    <input type="hidden" id="idRam">
    <input type="hidden" id="idGpu">
    <input type="hidden" id="idFuente">
    <input type="hidden" id="idDisco">
    <input type="hidden" id="slotsMobo">
    <input type="hidden" id="totalCantidad">
    <input type="hidden" id="cooler">
    <input type="hidden" name="totalVentaEfectivo" id="totalVentaEfectivo">
    <input type="hidden" name="totalVentaNormal" id="totalVentaNormal">
    <input type="hidden" name="voltaje" id="voltaje" value="0">
    <input type="hidden" id="voltajecpu" value="0">
    <input type="hidden" id="voltajegpu" value="0">
    <input type="hidden" id="coolNeed" value="0">
    <input type="hidden" id="gpuNeed" value="0">
    <input type="hidden" id="socketCool" value="0">
    <div class="container second mb-4 pt-4 pt-lg-5 pb-4">
        <center>

            <div class="row tercer pt-3 pt-lg-4">
                <div class="container p-0 p-lg-0 pl-4 m-0 interior1 col-12 col-lg-8 mb-0 mb-lg-4">

                    <div class="col-12 col-lg-12 pr-5 pl-8">
                        <h3 class="font-weight-bold" style="color: #e73d2c">¡ARMA LA KPC DE TUS SUEÑOS!</h3>
                        <p class="font-weight-bold text-center">• El configurador de PC personalizada de KPC Hardware,
                            es la
                            herramienta perfecta para que selecciones una a una las piezas de tu computadora,
                            y pruebes distintas configuraciones y presupuestos.</p>
                        <hr>
                        <div class="accordion" id="accordionExample">
                            <div class="card">
                                <div class="card-header  degradadoGris" id="headingOne">
                                    <h2 class="mb-0 text-left">

                                        <button class="btn btn-link" style="color: #565652;" type="button"
                                                data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"
                                                aria-controls="collapseOne">
                                            <img src="iconos_cat/Microprocesador.png" width="40" height="40"/>&nbsp;
                                            PROCESADOR <i class="fas fa-times" id="100" style="color: red"></i>
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                     data-parent="#accordionExample">
                                    <div class="card-body p-0 p-lg-3">
                                        <div class="col-12 p-0">
                                            <p class="text-left">
                                                <button class="btn btn-link" type="button" data-toggle="collapse"
                                                        data-target="#collapseExample" aria-expanded="false"
                                                        aria-controls="collapseExample">
                                                    INTEL
                                                </button>
                                            </p>
                                            <div class="collapse" id="collapseExample">
                                                <div class="card card-body p-0 p-lg-2 border-0">
                                                    <div id="accordion63" class="p-0  m-0 degradadoGris "
                                                         style="width: 100%">

                                                        <?php listarTodo(63); ?>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                        <hr>
                                        <div class="col-12 p-0">
                                            <p class="text-left">
                                                <button class="btn btn-link" type="button" data-toggle="collapse"
                                                        data-target="#amd" aria-expanded="false"
                                                        aria-controls="collapseExample">
                                                    AMD
                                                </button>
                                            </p>
                                            <div class="collapse  m-0 p-0" id="amd">
                                                <div class="card card-body p-0 p-sm-2 border-0">
                                                    <div id="accordion127" class="p-0 m-0 degradadoGris"
                                                         style="width: 100%">

                                                        <?php listarTodo(127); ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingTwo">
                                    <h2 class="mb-0 text-left">

                                        <button class="btn btn-link collapsed" id="placaBaseBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseTwo"
                                                aria-expanded="false" aria-controls="collapseTwo">
                                            <img src="iconos_cat/Placa base.png" width="35" height="35"/>&nbsp;
                                            PLACA BASE <i class="fas fa-times" id="99" style="color: red"></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="bodyPB">

                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingThree">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="caseBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseThree"
                                                aria-expanded="false" aria-controls="collapseThree">
                                            <img src="iconos_cat/Case.png" width="35" height="35"/>
                                            &nbsp;GABINETE <i class="fas fa-times" id="103" style="color: red"></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseThree" class="collapse" aria-labelledby="headingThree"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="bodyCase">

                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingFour">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="ramBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseFour"
                                                aria-expanded="false" aria-controls="collapseFour">
                                            <img src="iconos_cat/Memoria RAM.png" width="40" height="40"/>
                                            &nbsp;MEMORIA RAM <i class="fas fa-times" id="101" style="color: red"></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseFour" class="collapse" aria-labelledby="headingFour"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="ramBody">
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingFive">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="gpuBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseFive"
                                                aria-expanded="false" aria-controls="collapseFive">
                                            <img src="iconos_cat/Tarjeta grafica.png" width="40" height="40"/>
                                            &nbsp;TARJETA GRÁFICA <i class="fas fa-exclamation" id="102"
                                            ></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseFive" class="collapse" aria-labelledby="headingFive"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="gpuBody">
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingSix">
                                    <h2 class="mb-0">
                                        <button class="btn btn-link collapsed float-left text-left" id="fuenteBtn"
                                                style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseSix"
                                                aria-expanded="false" aria-controls="collapseSix">
                                            <img src="iconos_cat/Fuente de poder.png" width="40" height="40"/>
                                            &nbsp;FUENTE DE PODER <i class="fas fa-times" id="109"
                                                                     style="color: red"></i> <label>(Las fuentes
                                                mostradas, se sugieren en base al consumo de los componentes
                                                seleccionados)</label>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseSix" class="collapse" aria-labelledby="headingSix"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="fuenteBody">
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingSev">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="discoBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseSev"
                                                aria-expanded="false" aria-controls="collapseSev">
                                            <img src="iconos_cat/SSD.png" width="40" height="40"/>
                                            &nbsp;UNIDADES DE DATOS <i class="fas fa-times" id="118"
                                                                       style="color: red"></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseSev" class="collapse" aria-labelledby="headingSev"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="discoBody">
                                        <div class="accordion" id="accordionDisc">
                                            <div class="card">
                                                <div class="card-header text-left" id="headingDisc">
                                                    <h1 class="mb-0">
                                                        <button class="btn btn-link collapsed " type="button"
                                                                data-toggle="collapse" data-target="#collapseDisc"
                                                                aria-expanded="false" aria-controls="collapseDisc">
                                                            HDD
                                                        </button>
                                                    </h1>
                                                </div>
                                                <div id="collapseDisc" class="collapse" aria-labelledby="headingDisc"
                                                     data-parent="#accordionDisc">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(80) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="headingSsd">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapseSsd"
                                                                aria-expanded="false" aria-controls="collapseSsd">
                                                            SSD
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapseSsd" class="collapse" aria-labelledby="headingSsd"
                                                     data-parent="#accordionDisc">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(81) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="headingM2">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapseM2"
                                                                aria-expanded="false" aria-controls="collapseM2">
                                                            M.2
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapseM2" class="collapse" aria-labelledby="headingM2"
                                                     data-parent="#accordionDisc">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(82) ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingSev">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="airBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseEight"
                                                aria-expanded="false" aria-controls="collapseEight">
                                            <img src="iconos_cat/Air CPU cooler.png" width="40" height="40"/>
                                            &nbsp;COOLER DE AIRE <i class="fas fa-exclamation" id="104"
                                            ></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseEight" class="collapse" aria-labelledby="headingEight"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="airBody">
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingSev">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="liquiBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseNine"
                                                aria-expanded="false" aria-controls="collapseNine">
                                            <img src="iconos_cat/Liquid CPU cooler .png" width="40" height="40"/>
                                            &nbsp;COOLER DE LÍQUIDO <i class="fas fa-exclamation" id="105"
                                            ></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseNine" class="collapse" aria-labelledby="headingNine"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="liquiBody">
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header degradadoGris" id="headingSev">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="periBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseThen"
                                                aria-expanded="false" aria-controls="collapseThen">
                                            <img src="iconos_cat/Perifericos.png" width="40" height="40"/>
                                            &nbsp;PERIFÉRICOS <i class="fas fa-exclamation" id="110"></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseThen" class="collapse" aria-labelledby="headingThen"
                                     data-parent="#accordionExample">
                                    <div class="card-body p-0 p-lg-3" id="periBody">
                                        <div class="accordion" id="accordionPerif">
                                            <div class="card">
                                                <div class="card-header text-left" id="headingMouse">
                                                    <h1 class="mb-0">
                                                        <button class="btn btn-link collapsed " type="button"
                                                                data-toggle="collapse" data-target="#collapseMouse"
                                                                aria-expanded="false" aria-controls="collapseMouse">
                                                            Mouse
                                                        </button>
                                                    </h1>
                                                </div>
                                                <div id="collapseMouse" class="collapse" aria-labelledby="headingMouse"
                                                     data-parent="#accordionPerif">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(110) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="headingTec">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapseTec"
                                                                aria-expanded="false" aria-controls="collapseTec">
                                                            Teclado
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapseTec" class="collapse" aria-labelledby="headingTec"
                                                     data-parent="#accordionPerif">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(111) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="headingAu">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapseAu"
                                                                aria-expanded="false" aria-controls="collapseAu">
                                                            Auriculares
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapseAu" class="collapse" aria-labelledby="headingAu"
                                                     data-parent="#accordionPerif">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(155) ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header degradadoGris" id="headingElev">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="moniBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseElev"
                                                aria-expanded="false" aria-controls="collapseElev">
                                            <img src="iconos_cat/Monitor.png" width="40" height="40"/>
                                            &nbsp;MONITORES <i class="fas fa-exclamation" id="119"></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseElev" class="collapse" aria-labelledby="headingElev"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="moniBody">
                                        <div class="accordion" id="accordionMoni">
                                            <div class="card">
                                                <div class="card-header text-left" id="headingSub">
                                                    <h1 class="mb-0">
                                                        <button class="btn btn-link collapsed " type="button"
                                                                data-toggle="collapse" data-target="#collapseSub"
                                                                aria-expanded="false" aria-controls="collapseSub">
                                                            SUB HD
                                                        </button>
                                                    </h1>
                                                </div>
                                                <div id="collapseSub" class="collapse" aria-labelledby="headingSub"
                                                     data-parent="#accordionMoni">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(50) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="headingFull">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapseFull"
                                                                aria-expanded="false" aria-controls="collapseFull">
                                                            FULL HD
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapseFull" class="collapse" aria-labelledby="headingFull"
                                                     data-parent="#accordionMoni">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(51) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="heading2k">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapse2k"
                                                                aria-expanded="false" aria-controls="collapse2k">
                                                            2K
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapse2k" class="collapse" aria-labelledby="heading2k"
                                                     data-parent="#accordionMoni">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(52) ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card">
                                                <div class="card-header text-left" id="heading4k">
                                                    <h2 class="mb-0">
                                                        <button class="btn btn-link collapsed" type="button"
                                                                data-toggle="collapse" data-target="#collapse4k"
                                                                aria-expanded="false" aria-controls="collapse4k">
                                                            4K
                                                        </button>
                                                    </h2>
                                                </div>
                                                <div id="collapse4k" class="collapse" aria-labelledby="heading4k"
                                                     data-parent="#accordionMoni">
                                                    <div class="card-body p-0 p-lg-2 border-0">
                                                        <?php listarPeri(53) ?>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header degradadoGris" id="headingFive">
                                    <h2 class="mb-0 text-left">
                                        <button class="btn btn-link collapsed" id="upsBtn" style="color: #565652;"
                                                type="button" data-toggle="collapse" data-target="#collapseTwelve"
                                                aria-expanded="false" aria-controls="collapseTwelve">
                                            <img src="iconos_cat/UPS.png" width="40" height="40"/>
                                            &nbsp;UPS <i class="fas fa-exclamation" id="122"
                                            ></i>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseTwelve" class="collapse" aria-labelledby="headingFive"
                                     data-parent="#accordionExample">
                                    <div class="card-body" id="upsBody">
                                        <?php listarPeri(122) ?>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <hr>

                </div>
                <div class="col-12 col-lg-4 container interior2 pt-3 pt-lg-2">

                    <div class="col-11 col-lg-12 pb-1 p-0 bordes fondokpc">
                        <div class="col-12 col-lg-12"></div>
                        <h4 class="font-weight-bold pt-3 tamaño400"
                            style="font-family: sans-serif; color: #fff; background: ">TOTAL ACUMULADO</h4>
                    </div>

                    <div class="col-11 col-lg-12 p-0  degradadoGris pb-1">
                        <h4 class="font-weight-bold pt-3 textoPrecio tamaño400" style="font-family: sans-serif"><i
                                    class="far fa-credit-card"></i> Precio normal: $<label
                                    id="totalVentaTarjeta">0.00</label></h4>
                    </div>

                    <div class="col-11 col-lg-12 p-0 total1 degradadoGris">
                        <div class="col-12 col-lg-12  internoTotal1"></div>
                        <h4 class="font-weight-bold pt-3 pb-3 text-success tamaño400" style="font-family: sans-serif"><i
                                    class="far fa-money-bill-alt"></i> Precio efectivo: $<label
                                    id="totalVenta">0.00</label></h4>
                    </div>
                    <div class="col-11 col-lg-12 pb-1 p-0 bordes fondokpc">
                        <div class="col-12 col-lg-12"></div>
                        <h4 class="font-weight-bold pt-3 tamaño400"
                            style="font-family: sans-serif; color: #fff; background: ">Consumo estimado de componentes
                            seleccionados</h4>
                    </div>

                    <div class="col-11 col-lg-12 p-0  degradadoGris pb-1">
                        <h4 class="font-weight-bold pt-3 textoPrecio tamaño400"
                            style="font-family: sans-serif; color: #EE7B27"><i
                                    class="fas fa-bolt"></i> Total: <label
                                    id="totalWatts">0.00</label> Watts</h4>
                    </div>

                    <hr>
                    <hr>
                    <div class="col-11 col-lg-12">

                        <h3 class="col-12 col-sm-8 ml-0">Mis componentes</h3>

                        <div class="table-responsive">
                            <table class="table table-hover table-sm" id="lista">
                                <thead class="thead-dark">
                                <tr id="encabezado">
                                    <th scope="col" style="min-width: 400px">Componente</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col" style="min-width: 60px">Total</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Quitar</th>
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr>

                    <div class="col-11 col-lg-12 p-2 mt-3">
                        <div class="row">
                            <div class="col-12 col-lg-12 mr-4 mr-lg-2 text-center">
                                <p>* ¡Si lo que buscas es un súper precio por tu configuración, por favor haz clic en el
                                    botón de abajo!</p>
                                <button type="button" onclick="validarTabla()" style="text-align: center;"
                                        class="btn-env btn-lg">Enviar mi cotización a KPC
                                </button>
                            </div>

                        </div>
                    </div>
                    <hr>
                    <div>
                        <p class="font-weight-bold">Para enviar tu cotización, debes tener en cuenta la siguiente simbología: </p>
                      
                        <p>
                            &nbsp;<i class="fas fa-times" style="color: red"></i> Componente obligatorio.
                            <br>
                            <i class="fas fa-exclamation"></i> Componente opcional.
                            <br>
                            <i class="fas fa-check" style="color: green"></i> Componente agregado.
                        </p>
                    </div>

                    <hr>
                    <div class="wrapper">
                        <div class="col-11 col-lg-12 cuadroCel p-2" id="buenPrec">
                            <div class="row">
                                <div class="col-12 col-lg-12 mr-4 mr-lg-2 m-0 m-lg-0 text-center">
                                    <i class="fas fa-desktop" style="font-size: 40px"></i>
                                    <h5 class="text-center" style="font-size: 25px">
                                        Recuerda que el precio final de tu configuración tendrá un <b>BUEN DESCUENTO</b>
                                        cuando envíes tu cotización a KPC.
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-11 col-lg-12 cuadroVer p-2 mt-3">
                        <div class="row">
                            <div class="col-12 col-lg-12 mr-4 mr-lg-2 text-center">
                                <i class="fas fa-exclamation-triangle" style="font-size: 40px; "></i>
                                <h5 class="text-center">
                                    KPC revisará y evaluará tu configuración por posibles incompatibilidades, y, de
                                    haberlas, te notificaremos a los contactos que nos proporciones.
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div class="col-11 col-lg-12 cuadroRed p-2 mt-3">
                        <div class="row">
                            <div class="col-12 col-lg-12 mr-4 mr-lg-2 text-center">
                                <i class="fas fa-medal" style="font-size: 40px"></i>
                                <h5 class="text-center">
                                    Todas las máquinas ensambladas en KPC Hardware cuentan con un año de garantía.
                                </h5>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
        </center>
    </div>
    <!--MODAL-->
    <!-- Modal -->
    <div class="modal fade" id="modalFinal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
         aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title font-weight-bold" id="exampleModalLongTitle">
                        <center>Enviar a KPC Hardware</center>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="font-weight: bold; font-size: 13px"> Por favor, asegúrate de brindarnos datos que son
                        correctos para ponernos en contacto contigo lo más pronto posible.</p>
                    <div class="form-group">
                        <label for="recipient-name" class="col-form-label">¿Cuál es tu nombre?</label>
                        <input type="text" class="form-control" name="nombreCliente" id="recipient-name" required="">
                    </div>
                    <div class="form-group">
                        <label for="recipient-name" class="col-form-label">¿Cuál es tu correo electrónico?</label>
                        <input type="email" class="form-control" placeholder="alguien@ejemplo.com" name="correoCliente"
                               id="recipient-name" required="">
                    </div>
                    <div class="form-group">
                        <label for="recipient-name" class="col-form-label">¿Cuál es tu número telefónico?</label>
                        <input type="text"  placeholder="xxxx-xxxx" name="telCliente"
                               title="00000000" class="form-control" id="recipient-name" required="">
                    </div>
                    <div class="form-group">
                        <label for="message-text" class="col-form-label">¿Deseas agregar algo más? (opcional)</label>
                        <textarea class="form-control" id="message-text" name="comentarios"></textarea>
                    </div>

                        <label class="form-check-label" for="exampleCheck1">¿Deseas que un asesor te contacte por el
                            teléfono brindado para darle seguimiento a tu solicitud de cotización?</label><br><br>
                    <center>
                    <label class="radio-inline">
                        <input type="radio" value="Sí" name="terminos" required> Sí
                    </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label class="radio-inline">
                        <input type="radio" value="No" name="terminos" required> No
                    </label>
                    </center>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary" name="enviado">Enviar</button>
                </div>
            </div>
        </div>
    </div>
</form>
<script src="js/ajax.js" type="text/javascript"></script>
<script src="js/alertify.min.js" type="text/javascript"></script>
<script src="js/tabla.js" type="text/javascript"></script>
</body>
</html>