<?php
require './funciones/conexion.php';
require './funciones/productos_cate.php';

$categorias = obtenerCategoriasCoti($conexion);

?>
<html>

<head>

  <!-- Meta Pixel Code -->
  <script>
    ! function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '2869438393086978');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=2869438393086978&ev=PageView&noscript=1" /></noscript>
  <!-- End Meta Pixel Code -->

  <meta charset="UTF-8">
  <title>Cotiza tu KPC</title>
  <link rel="icon" type="image/png" href="img/icons/icon.ico" />
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>

  <!-- Popper JS -->
  <cript src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></cript>

  <!-- Latest compiled JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <link href="css/styles.css" rel="stylesheet" type="text/css" />
  <link href="js/css/alertify.min.css" rel="stylesheet" type="text/css" />
  <meta name="viewport" content="width=device-width, user-scalable=no">

  <meta property="og:url" content="https://www.kpchardware.com/personalizacion" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Cotiza tu KPC" />
  <meta property="og:description" content="Realiza tu cotización online con KPC Hardware" />
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

    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-card .card-body {
      flex-grow: 1;
    }

    .row .product-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
    }

    .fuente-hint {
      margin-left: 8px;
      font-size: 13px;
      color: #c2bbbb;
      font-weight: 400;
      letter-spacing: 0.2px;
    }

    #lista thead th {
      font-size: 14px;
    }

    #lista tbody td {
      font-size: 12.9px;
    }

    #lista {
      table-layout: fixed;
      width: 100%;
    }

    /* Anchos por columna */
    #lista th:nth-child(1),
    #lista td:nth-child(1) {
      width: 46%;
    }

    #lista th:nth-child(2),
    #lista td:nth-child(2) {
      width: 13%;
    }

    #lista th:nth-child(3),
    #lista td:nth-child(3) {
      width: 13%;
    }

    #lista th:nth-child(4),
    #lista td:nth-child(4) {
      width: 16%;
    }

    #lista th:nth-child(5),
    #lista td:nth-child(5) {
      width: 12%;
    }
  </style>
</head>

<body>
  <form action="funciones/enviar.php" method="POST" target="_blank">
    <div class="container first container-first">
      <a href="https://www.kpchardware.com" target="_blank" rel="noopener">
        <img src="img/5.png" class="img-fluid logo" alt="KPC Hardware" />
      </a>
    </div>
    <input type="hidden" id="catProce">
    <input type="hidden" id="catMobo">
    <input type="hidden" id="catProce" />
    <input type="hidden" id="idCase" />
    <input type="hidden" id="idRam" />
    <input type="hidden" id="idGpu" />
    <input type="hidden" id="idFuente" />
    <input type="hidden" id="idDisco" />
    <input type="hidden" id="slotsMobo" value="0" />
    <input type="hidden" id="totalCantidad" />
    <input type="hidden" name="totalVentaEfectivo" id="totalVentaEfectivo" />
    <input type="hidden" name="totalVentaNormal" id="totalVentaNormal" />
    <input type="hidden" name="voltaje" id="voltaje" value="0" />
    <input type="hidden" id="voltajecpu" value="0" />
    <input type="hidden" id="voltajegpu" value="0" />
    <input type="hidden" id="coolNeed" value="0" />
    <input type="hidden" id="gpuNeed" value="0" />
    <input type="hidden" id="idTamanioMoboCase" value="0" />

    <input type="hidden" id="caseIncluyeFuente" value="0" />
    <input type="hidden" id="caseIncluyeCooler" value="0" />

    <!-- Hidden para guardar id de categorías -->
    <input type="hidden" id="idProceCat" />
    <input type="hidden" id="idMoboCat" />
    <input type="hidden" id="idCaseCat" />

    <div class="container second mb-4 pt-4 pt-lg-5 pb-4">
      <center>
        <div class="row tercer pt-3 pt-lg-4">
          <!-- Columna izquierda: categorías -->
          <div class="container p-0 p-lg-0 pl-4 m-0 interior1 col-12 col-lg-8 mb-0 mb-lg-4">
            <div class="col-12 col-lg-12 pr-5 pl-8">
              <h3 class="font-weight-bold" style="color: #e73d2c">¡ARMA LA KPC DE TUS SUEÑOS!</h3>
              <p class="font-weight-bold text-center" style="color: #e8e8e8">
                • El configurador de PC personalizada de KPC Hardware, es la herramienta perfecta para que selecciones una a una las piezas de tu computadora, y pruebes distintas configuraciones y presupuestos.
              </p>
              <!-- Acordeón principal -->
              <div class="accordion" id="accordionExample">
                <?php foreach ($categorias as $index => $categoria) {
                  if (!in_array($categoria['id_category'], $perifericos_ids)) {

                    // PROCESADOR
                    if ($categoria['id_category'] == 100) { ?>
                      <div class="card">
                        <div class="card-header degradadoGris" id="headingCpu">
                          <h2 class="mb-0 text-left">
                            <button class="btn btn-link" style="color: #e8e8e8;" type="button"
                              data-toggle="collapse" data-target="#collapseCpu" aria-expanded="true"
                              aria-controls="collapseCpu" data-parent="#accordionExample">
                              <img src="iconos_cat/<?php echo $categoria['icono']; ?>" width="40" height="40"
                                style="vertical-align: middle; margin-right: 6px;" alt="Cpu" />
                              <span><?php echo $categoria['nombre']; ?></span>
                              <i class="fas fa-times" id="100" style="color: red; margin-left: 6px;"></i>
                            </button>
                          </h2>
                        </div>
                        <div id="collapseCpu" class="collapse show" aria-labelledby="headingCpu"
                          data-parent="#accordionExample">
                          <div class="accordion" id="accordionCPUInterno">
                            <?php mostrarProce(100, '#accordionCPUInterno'); ?>
                          </div>
                        </div>
                      </div>
                <?php
                    }

                    // UNIDADES DE DATOS
                    elseif ($categoria['id_category'] == 118) {
                      mostrarCardProducto('unidades', $categoria['nombre'], 118, '#accordionExample', $categoria['icono'], $categoria['id_btn'], $categoria['obligatorio']);
                    }

                    // PERIFÉRICOS
                    elseif ($categoria['id_category'] == 999) {
                      mostrarCardProducto('perifericos', 'PERIFÉRICOS', 999, '#accordionExample', null,  $categoria['id_btn'], $categoria['obligatorio']);
                    }

                    // MONITORES
                    elseif ($categoria['id_category'] == 119) {
                      mostrarCardProducto('monitores', $categoria['nombre'], 119, '#accordionExample', $categoria['icono'], $categoria['id_btn'], $categoria['obligatorio']);
                    }

                    // UPS
                    elseif ($categoria['id_category'] == 122) {
                      mostrarCardProducto('ups', $categoria['nombre'], 122, '#accordionExample', $categoria['icono'], $categoria['id_btn'], $categoria['obligatorio']);
                    }

                    // VENTILADORES
                    elseif ($categoria['id_category'] == 106) {
                      mostrarCardProducto('ventiladores', $categoria['nombre'], 106, '#accordionExample', $categoria['icono'], $categoria['id_btn'], $categoria['obligatorio']);
                    }

                    // MUEBLES
                    elseif ($categoria['id_category'] == 121) {
                      mostrarCardProducto('muebles', $categoria['nombre'], 121, '#accordionExample', $categoria['icono'], $categoria['id_btn'], $categoria['obligatorio']);
                    }

                    // Otras categorías normales
                    else {
                      mostrarCategoria($categoria, ucfirst($categoria['id_btn']), false, '#565652', true, '#accordionExample');
                    }
                  }
                } ?>
              </div>
            </div>
          </div>

          <!-- Columna derecha: totales y resumen -->

          <div class="col-12 col-lg-4 container interior2 pt-3 pt-lg-2">
            <div class="col-11 col-lg-12 pb-1 p-0 bordes fondokpc">
              <div class="col-12 col-lg-12"></div>
              <h4 class="font-weight-bold pt-3 tamaño400" style="font-family: sans-serif; color: #fff">TOTAL ACUMULADO</h4>
            </div>

            <div class="col-11 col-lg-12 p-0 degradadoGris pb-1">
              <h4 class="font-weight-bold pt-3 textoPrecio tamaño400" style="font-family: sans-serif; color: #e8e8e8">
                <i class="far fa-credit-card"></i> Precio normal: $<label id="totalVentaTarjeta">0.00</label>

              </h4>
            </div>

            <div class="col-11 col-lg-12 p-0 total1 degradadoGris">
              <div class="col-12 col-lg-12 internoTotal1"></div>
              <h4 class="font-weight-bold pt-3 pb-3" style="font-family: sans-serif; color: #39ff14">
                <i class="far fa-money-bill-alt"></i> Precio efectivo: $<label id="totalVenta">0.00</label>
              </h4>
            </div>

            <div class="col-11 col-lg-12 pb-1 p-0 bordes fondokpc">
              <div class="col-12 col-lg-12"></div>
              <h4 class="font-weight-bold pt-3 tamaño400" style="font-family: sans-serif; color: #fff;">
                Consumo estimado de componentes seleccionados
              </h4>
            </div>

            <div class="col-11 col-lg-12 p-0 degradadoGris pb-1">
              <h4 class="font-weight-bold pt-3 textoPrecio tamaño400" style="font-family: sans-serif; color: #ff9f43">
                <i class="fas fa-bolt"></i> Total:
                <label id="totalWatts">0.00</label>
                Watts
              </h4>
            </div>

            <hr />

            <div class="col-11 col-lg-12">
              <h3 class="col-12 col-sm-8 ml-0" style="color: #e8e8e8">Mis componentes</h3>
              <div class="table-responsive tabla-mis-componentes">
                <table class="table table-bordered table-hover table-sm text-center" id="lista">
                  <thead class="thead-dark">
                    <tr>
                      <th>Componente</th>
                      <th>Precio</th>
                      <th>Total</th>
                      <th>Cantidad</th>
                      <th>Quitar</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>

            <hr />

            <div class="col-11 col-lg-12 p-2 mt-3">
              <div class="row">
                <div class="col-12 col-lg-12 mr-4 mr-lg-2 text-center">
                  <p style="color: #e8e8e8">* ¡Si lo que buscas es un súper precio por tu configuración, por favor haz clic en el botón de abajo!</p>
                  <button type="button" onclick="validarTabla()" class="btn-send-kpc btn-lg" style="text-align: center;" aria-label="Enviar mi cotización a KPC">
                    <i class="fas fa-paper-plane"></i>
                    <span class="btn-text">Enviar mi cotización a KPC</span>
                  </button>
                </div>
              </div>
            </div>

            <hr />

            <div>
              <p class="font-weight-bold" style="color: #e8e8e8">Para enviar tu cotización, debes tener en cuenta la siguiente simbología:</p>
              <p style="color: #e8e8e8">
                &nbsp;<i class="fas fa-times" style="color: red"></i> Componente obligatorio.<br />
                <i class="fas fa-exclamation"></i> Componente opcional.<br />
                <i class="fas fa-check" style="color: green; animation: none;"></i> Componente agregado.
              </p>
            </div>

            <hr />

            <div class="wrapper">
              <div class="col-11 col-lg-12 cuadroCel p-2" id="buenPrec">
                <div class="row">
                  <div class="col-12 col-lg-12 mr-4 mr-lg-2 m-0 m-lg-0 text-center">
                    <i class="fas fa-desktop" style="font-size: 40px"></i>
                    <h5 class="text-center" style="font-size: 25px">
                      Recuerda que el precio final de tu configuración <b>tendrá descuento</b> cuando envíes tu cotización a KPC.
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-11 col-lg-12 cuadroVer p-2 mt-3">
              <div class="row">
                <div class="col-12 col-lg-12 mr-4 mr-lg-2 text-center">
                  <i class="fas fa-exclamation-triangle" style="font-size: 40px;"></i>
                  <h5 class="text-center">
                    KPC revisará y evaluará tu configuración por posibles incompatibilidades, y, de haberlas, te notificaremos a los contactos que nos proporciones.
                  </h5>
                </div>
              </div>
            </div>

            <div class="col-11 col-lg-12 cuadroRed p-2 mt-3 mb-2">
              <div class="row">
                <div class="col-12 col-lg-12 mr-4 mr-lg-2 text-center">
                  <i class="fas fa-medal" style="font-size: 40px"></i>
                  <h5 class="text-center">Todas las máquinas ensambladas en KPC Hardware cuentan con un año de garantía.</h5>
                </div>
              </div>
            </div>
            <br>

          </div>
        </div>
      </center>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalFinal" tabindex="-1" role="dialog" aria-labelledby="modalEnviarTitulo" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content" style="background-color: #2d3d47; color: #e8e8e8;">
          <div class="modal-header" style="border-bottom-color: #3a4a55;">
            <h5 class="modal-title font-weight-bold" id="modalEnviarTitulo">
              <center>Enviar a KPC Hardware</center>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #e8e8e8;">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <p style="font-weight: bold; font-size: 13px; color: #e8e8e8">
              Por favor, asegúrate de brindarnos datos que son correctos para ponernos en contacto contigo lo más pronto posible.
            </p>

            <div class="form-group">
              <label for="nombreCliente" class="col-form-label" style="color: #e8e8e8">¿Cuál es tu nombre?</label>
              <input type="text" class="form-control" name="nombreCliente" id="nombreCliente" style="background-color: #1a2530; color: #e8e8e8; border-color: #3a4a55;" required />
            </div>

            <div class="form-group">
              <label for="correoCliente" class="col-form-label" style="color: #e8e8e8">¿Cuál es tu correo electrónico?</label>
              <input type="email" class="form-control" placeholder="alguien@ejemplo.com" name="correoCliente" id="correoCliente" style="background-color: #1a2530; color: #e8e8e8; border-color: #3a4a55;" required />
            </div>

            <div class="form-group">
              <label for="telCliente" class="col-form-label" style="color: #e8e8e8">¿Cuál es tu número telefónico?</label>
              <input type="text" placeholder="xxxx-xxxx" name="telCliente" title="00000000" class="form-control" id="telCliente" style="background-color: #1a2530; color: #e8e8e8; border-color: #3a4a55;" required />
            </div>

            <div class="form-group">
              <label for="comentarios" class="col-form-label" style="color: #e8e8e8">¿Deseas agregar algo más? (opcional)</label>
              <textarea class="form-control" id="comentarios" name="comentarios" style="background-color: #1a2530; color: #e8e8e8; border-color: #3a4a55;"></textarea>
            </div>

            <label class="form-check-label" style="color: #e8e8e8" for="contactoTelefono">¿Deseas que un asesor te contacte por el teléfono brindado para darle seguimiento a tu solicitud de cotización?</label>
            <br /><br />

            <center>
              <label class="radio-inline mr-4" style="color: #e8e8e8">
                <input type="radio" value="Sí" name="terminos" id="contactoTelefono" required />
                Sí
              </label>
              <label class="radio-inline" style="color: #e8e8e8">
                <input type="radio" value="No" name="terminos" required />
                No
              </label>
            </center>
          </div>

            <div class="modal-footer" style="border-top-color: #3a4a55;">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" style="background-color: #3a4a55; border-color: #3a4a55;">Cerrar</button>
            <button type="submit" class="btn btn-primary" name="enviado">
              <i class="fas fa-paper-plane"></i>
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>

  <!-- App scripts -->
  <script src="js/alertify.min.js" type="text/javascript"></script>
  <script src="js/tabla.js" type="text/javascript"></script>
  <script src="js/obtenerFactorPrecio.js" type="text/javascript"></script>
  <script src="js/obtenerProductos.js" type="text/javascript"></script>
</body>

</html>