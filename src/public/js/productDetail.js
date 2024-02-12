console.log('productDetail is Alive!')

function extractPidFromURL() {
    const currentUrl = window.location.pathname;
    const pidIndex = currentUrl.lastIndexOf('/');
    const pid = currentUrl.substring(pidIndex + 1);
    return pid;
}

const baseURL = "http://localhost:8080";
const pid = extractPidFromURL();

async function getProductDetail(productId) {
    console.log('ejecutando getProductDetail en productDetail.js');
    try {
        const response = await fetch(`${baseURL}/api/products/${productId}`);
        if (response.ok) {
            const producto = await response.json();
            //verificar en fs si devuelve lo mismo  console.log(producto.productById)
            return producto.productById;
        } else {
            console.error("Error al obtener productos: ", response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

async function renderCartDetail(productId) {
    console.log('Detalle producto para renderizar con ID:', productId);
    const div = document.getElementById('productDetailDiv');
    try {
        const response = await getProductDetail(productId);
        console.log('getProductDetail response', response);

        const productDetailsDiv = document.createElement('div');
        productDetailsDiv.classList.add('product-details');

        const titulo = document.createElement('p');
        titulo.classList.add('productTitle');
        titulo.textContent = `Título: ${response.title}`;

        const codigo = document.createElement('p');
        codigo.classList.add('productCode');
        codigo.textContent = `Código: ${response.code}`;

        const precio = document.createElement('p');
        precio.classList.add('productPrice');
        precio.textContent = `Precio: ${response.price}`;

        const status = document.createElement('p');
        status.classList.add('productStatus');
        status.textContent = `Estado: ${response.status ? 'Habilitado' : 'Deshabilitado'}`;

        const stock = document.createElement('p');
        stock.classList.add('productStock');
        stock.textContent = `Stock: ${response.stock}`;

        const categoria = document.createElement('p');
        categoria.classList.add('productCategory');
        categoria.textContent = `Categoría: ${response.category}`;

        // Agregar cada detalle del producto al contenedor de detalles del producto
        productDetailsDiv.appendChild(titulo);
        productDetailsDiv.appendChild(codigo);
        productDetailsDiv.appendChild(precio);
        productDetailsDiv.appendChild(status);
        productDetailsDiv.appendChild(stock);
        productDetailsDiv.appendChild(categoria);

        // Agregar la sección de detalles del producto al contenedor en el DOM
        div.appendChild(productDetailsDiv);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

renderCartDetail(pid);