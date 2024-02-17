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
};

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
};



async function renderCartDetailTabla(cartId) {
    let totalCompra = 0; // Variable para almacenar el total de la compra
    try {
        const response = await getCartDetail(cartId);
        const tableBody = document.getElementById('cartDetailBody');

        // Limpiar el contenido actual de la tabla
        tableBody.innerHTML = '';

        // Si la respuesta es exitosa y contiene la información esperada
        if (response.success && response.cartById && response.cartById.products) {
            for (const producto of response.cartById.products) {
                const getProduct = await getProductDetail(producto.productoId);
                const productDetail = getProduct.productById;

                if (productDetail) {
                    const row = document.createElement('tr');

                    // Columna de Producto
                    const productCell = document.createElement('td');
                    const productLink = document.createElement('a');
                    productLink.href = `${baseURL}/products/${productDetail._id}`;
                    productLink.textContent = productDetail.title;
                    const productIdPara = document.createElement('p');
                    productIdPara.textContent = productDetail._id;
                    productCell.appendChild(productLink);
                    productCell.appendChild(productIdPara);
                    row.appendChild(productCell);

                    // Columna de Cantidad
                    const quantityCell = document.createElement('td');
                    quantityCell.textContent = producto.quantity;
                    row.appendChild(quantityCell);

                    // Columna de Valor unitario
                    const priceCell = document.createElement('td');
                    priceCell.textContent = productDetail.price;
                    row.appendChild(priceCell);

                    // Columna de Total
                    const totalProducto = producto.quantity * productDetail.price; // Calculamos el total del producto
                    totalCompra += totalProducto; // Sumamos al total de la compra
                    const totalCell = document.createElement('td');
                    totalCell.textContent = totalProducto;
                    row.appendChild(totalCell);

                    // Columna de botones de acción
                    const actionsCell = document.createElement('td');
                    const btnQuitar = document.createElement('a');
                    btnQuitar.href = '#';
                    btnQuitar.textContent = 'Quitar';
                    btnQuitar.dataset.productId = producto.productoId;
                    btnQuitar.addEventListener('click', handleRemoveFromCartClick);
                    actionsCell.appendChild(btnQuitar);

                    const btnAgregar = document.createElement('a');
                    btnAgregar.href = '#';
                    btnAgregar.textContent = 'Agregar';
                    btnAgregar.dataset.productId = producto.productoId;
                    btnAgregar.addEventListener('click', handleAddToCartClick);
                    actionsCell.appendChild(btnAgregar);

                    const btnEliminar = document.createElement('a');
                    btnEliminar.href = '#';
                    btnEliminar.textContent = 'Eliminar';
                    btnEliminar.dataset.productId = producto.productoId;
                    btnEliminar.addEventListener('click', handleDeleteFromCartClick);
                    actionsCell.appendChild(btnEliminar);

                    row.appendChild(actionsCell);

                    tableBody.appendChild(row);
                } else {
                    console.error(`No se pudieron obtener detalles del producto con ID ${producto._id}`);
                }
            }
        } else {
            console.error('La respuesta no contiene la información esperada.');
        }

        // Agregar la última fila con el total de la compra
        const totalRow = document.createElement('tr');
        const totalTitleCell = document.createElement('td');
        totalTitleCell.textContent = 'Total de la compra';
        totalRow.appendChild(totalTitleCell);
        for (let i = 0; i < 3; i++) { // Llenar tres columnas vacías antes de la columna Total
            totalRow.appendChild(document.createElement('td'));
        }
        const totalCell = document.createElement('td');
        totalCell.textContent = totalCompra;
        totalRow.appendChild(totalCell);
        totalRow.appendChild(document.createElement('td')); // Columna vacía para los botones de acción
        tableBody.appendChild(totalRow);

    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
};

async function handleAddToCartClick(event) {
    event.preventDefault();
    const productId = event.target.dataset.productId;
    await handleCartAction(productId, 1);
}

async function handleRemoveFromCartClick(event) {
    event.preventDefault();
    const productId = event.target.dataset.productId;
    await handleCartAction(productId, -1);
}

async function handleDeleteFromCartClick(event) {
    event.preventDefault();
    Swal.fire({
        title: 'Función no implementada',
        text: 'La función para eliminar un producto del carrito aún no está implementada',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
}

async function handleCartAction(productId, quantity) {
    let currentUserId;
    let currentCartId;

    // Obtener información del usuario del Local Storage
    const userData = JSON.parse(localStorage.getItem('APIuser'));
    if (userData === null) {
        currentUserId = "nouser";
        // Obtener el carrito almacenado en el Local Storage
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (!storedCart) {
            currentCartId = null;
        } else {
            currentCartId = storedCart.cart;
        }
    } else {
        currentCartId = userData.cart;
        currentUserId = userData._id;
    }

    let actionUrl;
    let method;

    if (currentCartId === null) {
        actionUrl = `/api/carts/addproduct/${currentUserId}`;
        method = "POST";
    } else {
        actionUrl = `/api/carts/${currentCartId}`;
        method = "PUT";
    }

    try {
        const response = await fetch(actionUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: [{
                    productId: productId,
                    quantity: quantity
                }]
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            const carritoUsuario = responseData.carritoUsuario;
            console.log('Carrito del usuario:', carritoUsuario);

            localStorage.setItem('cart', JSON.stringify({
                cart: carritoUsuario._id
            }));
            // Actualizar la tabla después de realizar la acción
            await renderCartDetailTabla(carritoUsuario._id);
        } else {
            console.error('Error al realizar la acción en el carrito:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud fetch:', error);
    }
}




renderCartDetailTabla(cid);
//renderCartDetail(cid);



