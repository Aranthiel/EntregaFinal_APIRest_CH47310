console.log('cartDetail.js is Alive!')

function extractCidFromURL() {
    const currentUrl = window.location.pathname;
    const cidIndex = currentUrl.lastIndexOf('/');
    const cid = currentUrl.substring(cidIndex + 1);
    return cid;
}

const baseURL = "http://localhost:8080";
const cid = extractCidFromURL();
console.log(cid);

async function getCartDetail(cartId) {
    try {
        const response = await fetch(`${baseURL}/api/carts/${cartId}`);
        if (response.ok) {
            const productos = await response.json();
            return productos;
        } else {
            console.error("Error al obtener productos: ", response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

async function getProductDetail(productId) {
    try {
        const response = await fetch(`${baseURL}/api/products/${productId}`);
        if (response.ok) {
            const productDetail = await response.json();
            return productDetail;
        } else {
            console.error(`Error al obtener detalles del producto con ID ${productId}: `, response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener detalles del producto con ID ${productId}:`, error);
        return null;
    }
}

async function renderCartDetail(cartId) {
    console.log('Detalle carrito para renderizar con ID:', cartId);
    try {
        const response = await getCartDetail(cartId);
        console.log('getCartDetail response', response);

        const ul = document.getElementById('cartDetailUl');
        const title = document.querySelector('h3');
        title.textContent = `Detalle de carrito ID ${cartId}`;

        // Limpia el contenido actual de la lista ul
        ul.innerHTML = '';

        // Si la respuesta es exitosa y contiene la información esperada
        if (response.success && response.cartById && response.cartById.products) {
            for (const producto of response.cartById.products) {
                
                const li = document.createElement('li');
                li.classList.add('cartProductLi');
    
                const getProduct = await getProductDetail(producto.productoId);
                const productDetail = getProduct.productById
                console.log('producto linea 67',productDetail)
                if (productDetail) {
                    const anchor = document.createElement('a');
                    anchor.href = `${baseURL}/products/${productDetail._id}`;
                    anchor.textContent = `Titulo: ${productDetail.title} - Cantidad: ${producto.quantity} - Precio: ${productDetail.price} - Total: ${producto.quantity * productDetail.price}`;
                    li.appendChild(anchor);
                    ul.appendChild(li);
                } else {
                    console.error(`No se pudieron obtener detalles del producto con ID ${producto._id}`);
                }
            }
        } else {
            console.error('La respuesta no contiene la información esperada.');
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

renderCartDetail(cid);



