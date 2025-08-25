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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>

  <!-- Latest compiled JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <link href="css/styles.css" rel="stylesheet" type="text/css" />
  <link href="js/css/alertify.min.css" rel="stylesheet" type="text/css" />
  <meta name="viewport" content="width=device-width, user-scalable=no">

  <meta property="og:url" content="https://www.kpchardware.com/personalizacion" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Cotiza tu KPC" />
  <meta property="og:description" content="Realiza tu cotización online con KPC Hardware" />
  <meta property="og:image" content="https://www.kpchardware.com/personalizacion/img/fb_shares.jpg" />
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
  </style>
</head>

<body>
  <form action="funciones/enviar.php" method="POST" target="_blank">
    <div class="container first container-first">
      <a href="https://www.kpchardware.com" target="_blank" rel="noopener">
        <img src="img/5.png" class="img-fluid logo" alt="KPC Hardware" />
      </a>
    </div>

    <input type="hidden" id="catProce" />
    <input type="hidden" id="catMobo" />
    <input type="hidden" id="idMobo" />
    <input type="hidden" id="idCase" />
    <input type="hidden" id="idRam" />
    <input type="hidden" id="idGpu" />
    <input type="hidden" id="idFuente" />
    <input type="hidden" id="idDisco" />
    <input type="hidden" id="slotsMobo" />
    <input type="hidden" id="totalCantidad" />
    <input type="hidden" id="cooler" />
    <input type="hidden" name="totalVentaEfectivo" id="totalVentaEfectivo" />
    <input type="hidden" name="totalVentaNormal" id="totalVentaNormal" />
    <input type="hidden" name="voltaje" id="voltaje" value="0" />
    <input type="hidden" id="voltajecpu" value="0" />
    <input type="hidden" id="voltajegpu" value="0" />
    <input type="hidden" id="coolNeed" value="0" />
    <input type="hidden" id="gpuNeed" value="0" />
    <input type="hidden" id="socketCool" value="0" />

    <div class="container second mb-4 pt-4 pt-lg-5 pb-4">
      <center>
        <div class="row tercer pt-3 pt-lg-4">
          <!-- Columna izquierda: categorías -->
          <div class="container p-0 p-lg-0 pl-4 m-0 interior1 col-12 col-lg-8 mb-0 mb-lg-4">
            <div class="col-12 col-lg-12 pr-5 pl-8">
              <h3 class="font-weight-bold" style="color: #e73d2c">¡ARMA LA KPC DE TUS SUEÑOS!</h3>
              <p class="font-weight-bold text-center">
                • El configurador de PC personalizada de KPC Hardware, es la herramienta perfecta para que selecciones una a una las piezas de tu computadora, y pruebes distintas configuraciones y presupuestos.
              </p>
              <hr />
              <!-- Acordeón principal -->
              <div class="accordion" id="accordionExample">
                <?php foreach ($categorias as $index => $categoria) {
                  if (!in_array($categoria['id_category'], $perifericos_ids)) {

                    // PROCESADOR
                    if ($categoria['id_category'] == 100) { ?>
                      <div class="card">
                        <div class="card-header degradadoGris" id="headingCPU">
                          <h2 class="mb-0 text-left">
                            <button class="btn btn-link" style="color: #565652;" type="button"
                              data-toggle="collapse" data-target="#collapseCPU" aria-expanded="true"
                              aria-controls="collapseCPU" data-parent="#accordionExample">
                              <img src="iconos_cat/<?php echo $categoria['icono']; ?>" width="40" height="40"
                                style="vertical-align: middle; margin-right: 6px;" alt="CPU" />
                              <span><?php echo $categoria['nombre']; ?></span>
                              <i class="fas fa-times" id="100" style="color: red; margin-left: 6px;"></i>
                            </button>
                          </h2>
                        </div>
                        <div id="collapseCPU" class="collapse show" aria-labelledby="headingCPU"
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
                      mostrarCardProducto('unidades', $categoria['nombre'], 118, '#accordionExample', $categoria['icono']);
                    }

                    // PERIFÉRICOS
                    elseif ($categoria['id_category'] == 999) {
                      mostrarCardProducto('perifericos', 'PERIFÉRICOS', null, '#accordionExample');
                    }

                    // MONITORES
                    elseif ($categoria['id_category'] == 119) {
                      mostrarCardProducto('monitores', 'MONITORES', 119, '#accordionExample', 'monitor.png');
                    }

                    // UPS
                    elseif ($categoria['id_category'] == 122) {
                      mostrarCardProducto('ups', $categoria['nombre'], 122, '#accordionExample', $categoria['icono']);
                    }

                    // Otras categorías normales
                    else {
                      mostrarCategoria($categoria, $index, false, '#565652', true, '#accordionExample');
                    }
                  }
                } ?>
              </div>
              <!-- /Acordeón principal -->
              <hr />
            </div>
          </div>

          <!-- Columna derecha: totales y resumen -->
          <div class="col-12 col-lg-4 container interior2 pt-3 pt-lg-2">
            <div class="col-11 col-lg-12 pb-1 p-0 bordes fondokpc">
              <div class="col-12 col-lg-12"></div>
              <h4 class="font-weight-bold pt-3 tamaño400" style="font-family: sans-serif; color: #fff">TOTAL ACUMULADO</h4>
            </div>

            <div class="col-11 col-lg-12 p-0 degradadoGris pb-1">
              <h4 class="font-weight-bold pt-3 textoPrecio tamaño400" style="font-family: sans-serif">
                <i class="far fa-credit-card"></i> Precio normal: $<label id="totalVentaTarjeta">0.00</label>

              </h4>
            </div>

            <div class="col-11 col-lg-12 p-0 total1 degradadoGris">
              <div class="col-12 col-lg-12 internoTotal1"></div>
              <h4 class="font-weight-bold pt-3 pb-3 text-success tamaño400" style="font-family: sans-serif">
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
              <h4 class="font-weight-bold pt-3 textoPrecio tamaño400" style="font-family: sans-serif; color: #EE7B27">
                <i class="fas fa-bolt"></i> Total:
                <label id="totalWatts">0.00</label>
                Watts
              </h4>
            </div>

            <hr />

            <div class="col-11 col-lg-12">
              <h3 class="col-12 col-sm-8 ml-0">Mis componentes</h3>
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
                  <p>* ¡Si lo que buscas es un súper precio por tu configuración, por favor haz clic en el botón de abajo!</p>
                  <button type="button" onclick="validarTabla()" class="btn-env btn-lg" style="text-align: center;">
                    Enviar mi cotización a KPC
                  </button>
                </div>
              </div>
            </div>

            <hr />

            <div>
              <p class="font-weight-bold">Para enviar tu cotización, debes tener en cuenta la siguiente simbología:</p>
              <p>
                &nbsp;<i class="fas fa-times" style="color: red"></i> Componente obligatorio.<br />
                <i class="fas fa-exclamation"></i> Componente opcional.<br />
                <i class="fas fa-check" style="color: green"></i> Componente agregado.
              </p>
            </div>

            <hr />

            <div class="wrapper">
              <div class="col-11 col-lg-12 cuadroCel p-2" id="buenPrec">
                <div class="row">
                  <div class="col-12 col-lg-12 mr-4 mr-lg-2 m-0 m-lg-0 text-center">
                    <i class="fas fa-desktop" style="font-size: 40px"></i>
                    <h5 class="text-center" style="font-size: 25px">
                      Recuerda que el precio final de tu configuración tendrá un <b>BUEN DESCUENTO</b> cuando envíes tu cotización a KPC.
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
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title font-weight-bold" id="modalEnviarTitulo">
              <center>Enviar a KPC Hardware</center>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <p style="font-weight: bold; font-size: 13px">
              Por favor, asegúrate de brindarnos datos que son correctos para ponernos en contacto contigo lo más pronto posible.
            </p>

            <div class="form-group">
              <label for="nombreCliente" class="col-form-label">¿Cuál es tu nombre?</label>
              <input type="text" class="form-control" name="nombreCliente" id="nombreCliente" required />
            </div>

            <div class="form-group">
              <label for="correoCliente" class="col-form-label">¿Cuál es tu correo electrónico?</label>
              <input type="email" class="form-control" placeholder="alguien@ejemplo.com" name="correoCliente" id="correoCliente" required />
            </div>

            <div class="form-group">
              <label for="telCliente" class="col-form-label">¿Cuál es tu número telefónico?</label>
              <input type="text" placeholder="xxxx-xxxx" name="telCliente" title="00000000" class="form-control" id="telCliente" required />
            </div>

            <div class="form-group">
              <label for="comentarios" class="col-form-label">¿Deseas agregar algo más? (opcional)</label>
              <textarea class="form-control" id="comentarios" name="comentarios"></textarea>
            </div>

            <label class="form-check-label" for="contactoTelefono">¿Deseas que un asesor te contacte por el teléfono brindado para darle seguimiento a tu solicitud de cotización?</label>
            <br /><br />

            <center>
              <label class="radio-inline mr-4">
                <input type="radio" value="Sí" name="terminos" id="contactoTelefono" required />
                Sí
              </label>
              <label class="radio-inline">
                <input type="radio" value="No" name="terminos" required />
                No
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

  <!-- App scripts -->
  <script src="js/ajax.js?v1.1" type="text/javascript"></script>
  <script src="js/alertify.min.js" type="text/javascript"></script>
  <script src="js/tabla.js" type="text/javascript"></script>
  <script src="js/obtenerFactorPrecio.js" type="text/javascript"></script>
  <script src="js/obtenerProductos.js" type="text/javascript"></script>
</body>

</html>