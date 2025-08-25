let cate_principal = null;
let cate_padre = null;

function traerProductosAsociados(cate_principal, cate_padre) {
    fetch('funciones/traer_productos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `cate_principal=${cate_principal}&cate_padre=${cate_padre}`
    })
    .then(response => response.text())
    .then(html => {
        // Mostrar los productos en el contenedor de productos de la categoría padre
        const contenedor = document.querySelector(`#cat-${cate_padre} .card-body`);
        contenedor.innerHTML = html;
    })
    .catch(err => console.error(err));
}


document.addEventListener('click', function(e) {
    const btn = e.target.closest('button[data-cat-id]');
    if (btn) {
        const clickedId = btn.getAttribute('data-cat-id');

        // Si ya tenemos un cate_principal seleccionado, el siguiente clic será cate_padre
        if (!cate_principal) {
            cate_principal = clickedId;
            console.log('Cate principal seleccionado:', cate_principal);
        } else {
            cate_padre = clickedId;
            console.log('Cate padre seleccionado:', cate_padre);

            // Llamada AJAX para traer productos asociados
            traerProductosAsociados(cate_principal, cate_padre);

            // Resetear cate_principal para la próxima selección
            cate_principal = null;
            cate_padre = null;
        }
    }
});
