async function renderCartDetail(cartId) {
    console.log('Detalle carrito para renderizar con ID:', cartId);
    try {
        const response = await getCartDetail(cartId);
        console.log('getCartDetail response', response);

        const tableBody = document.getElementById('cartDetailBody');
        const title = document.querySelector('h3');
        title.textContent = `Detalle de carrito ID ${cartId}`;

        // Limpiar el contenido actual de la tabla
        tableBody.innerHTML = '';

        // Si la respuesta es exitosa y contiene la información esperada
        if (response.success && response.cartById && response.cartById.products) {
            for (const producto of response.cartById.products) {
                const tr = document.createElement('tr');

                const getProduct = await getProductDetail(producto.productoId);
                const productDetail = getProduct.productById;
                
                if (productDetail) {
                    const productTitle = document.createElement('td');
                    productTitle.textContent = productDetail.title;
                    const productId = document.createElement('span');
                    productId.textContent = `(${productDetail._id})`;
                    productId.style.fontSize = '80%';
                    productTitle.appendChild(productId);

                    const cantidad = document.createElement('td');
                    cantidad.textContent = producto.quantity;

                    const valorUnitario = document.createElement('td');
                    valorUnitario.textContent = productDetail.price;

                    const total = document.createElement('td');
                    total.textContent = producto.quantity * productDetail.price;

                    const addOneBtn = document.createElement('button');
                    addOneBtn.textContent = '+1';
                    // Agregar lógica para aumentar la cantidad
                    // addOneBtn.addEventListener('click', () => {});

                    const removeOneBtn = document.createElement('button');
                    removeOneBtn.textContent = '-1';
                    // Agregar lógica para reducir la cantidad
                    // removeOneBtn.addEventListener('click', () => {});

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    // Agregar lógica para eliminar el producto del carrito
                    // deleteBtn.addEventListener('click', () => {});

                    const actions = document.createElement('td');
                    actions.appendChild(addOneBtn);
                    actions.appendChild(removeOneBtn);
                    actions.appendChild(deleteBtn);

                    tr.appendChild(productTitle);
                    tr.appendChild(cantidad);
                    tr.appendChild(valorUnitario);
                    tr.appendChild(total);
                    tr.appendChild(actions);

                    tableBody.appendChild(tr);
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
