
console.log("CartsView is alive!");

const baseURL = "http://localhost:8080";
document.addEventListener('DOMContentLoaded', ()=>{
    const socketClient = io();
    const productsDiv = document.getElementById("cartOptions");
    const cartsDiv = document.getElementById("showCarts");
    const cartDetailDiv = document.getElementById("showCartDetail");

    const title = document.createElement("h2");
    title.textContent = "Productos";

    const titleCarts = document.createElement("h2");
    titleCarts.textContent = "Carritos";

    const titleDetail = document.createElement("h2");
    titleDetail.textContent = "Detalle";

    const newCartButton = document.createElement("button");
    newCartButton.textContent = "crear carrito";

    socketClient.emit('cartViewLoaded');

    // Inicializar productos como un arreglo vacío
    let productos = [];
    //console.log('productos', productos);

    //renderizar los productos en el DOM
    function renderProducts(productos) {
        //console.log('productos para renderizar', productos )
        console.log('ejecutando renderProducts en cartsView.js')
        const ul = document.createElement("ul");
        
        productos.forEach((producto) => {
            const li = document.createElement("li");
            li.id = `product_${producto._id}`;
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox_${producto._id}`;
            li.appendChild(checkbox);
        
            const productInfo = document.createElement("span");
            productInfo.textContent = `Título: ${producto.title}, Precio: ${producto.price}, ID: ${producto._id}`;
            li.appendChild(productInfo);
        
            ul.appendChild(li);
        });

        productsDiv.innerHTML = "";
        productsDiv.appendChild(title);
        productsDiv.appendChild(ul);
        productsDiv.appendChild(newCartButton);
    }

    // Escuchar el evento para recibir los productos iniciales
    socketClient.on("productosInicialesRT", (productosIniciales) => {
        console.log(' escuchando el evento productosInicialesRT en CartsView')
        //console.log('productosIniciales en cartsViews.js', productosIniciales);
        productos = productosIniciales.products;
        renderProducts(productos);
    });

    socketClient.on("productsUpdated", (productosActualizados) => {
        console.log(' escuchando el evento productsUpdated en carts view')
        //console.log('productsUpdated en realtimeproducts.js', productosActualizados);
        productos = productosActualizados.products;
        renderProducts(productos);
    });
        
    // Agregar lógica para eliminar productos
    newCartButton.addEventListener("click", () => {
        const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedProductIds = Array.from(selectedCheckboxes).map((checkbox) => {
            return checkbox.id.replace("checkbox_", "");
        });

        const confirmation = Swal.fire({
            title: 'Estàs por crear un carrito',
            text: `Ha seleccionado ${selectedProductIds.length} productos para eliminar`, 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        });

        confirmation.then((result) => {
            if (result.isConfirmed) {
                // Emitir el evento "borrar" con los IDs de los productos seleccionados
                console.log('Enviando evento "crearCarrito" con los siguientes datos:', selectedProductIds);
                socketClient.emit("crearCarrito", selectedProductIds);

                // Desmarcar las checkbox
                selectedCheckboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });
            }
        });
    });

    // Inicializar carritos como un arreglo vacío
    let carritos = [];
    //console.log('carritos', carritos);

    //renderizar los carritos en el DOM
    function renderCarts(carritos) {
        console.log('ejecutando renderCarts en cartsView.js')
        //console.log('carritos para renderizar', carritos )
        const ul = document.createElement("ul");
        
        carritos.forEach((carrito) => {
            const li = document.createElement("li");
            li.id = `carrito_${carrito._id}`;
            
            const cartDetailBtn = document.createElement("button");
            cartDetailBtn.textContent = "Ver Detalle";
            cartDetailBtn.id = `cartDetailBtn_${carrito._id}`;
            cartDetailBtn.addEventListener("click", () => {
                verDetalleCarrito(carrito._id);
                renderCartDetail(carrito._id);
                console.log(`Detalles del carrito con ID: ${carrito._id}`);
            });
            li.appendChild(cartDetailBtn); 
        
            const cartId_ = document.createElement("span");
            cartId_.textContent = `ID: ${carrito._id}`;
            li.appendChild(cartId_);
        
            ul.appendChild(li);
        });

        cartsDiv.innerHTML = "";
        cartsDiv.appendChild(titleCarts);
        cartsDiv.appendChild(ul);
    }

    function verDetalleCarrito(carritoId) {
        console.log(`Detalles del carrito con ID: ${carritoId}`);
        // Puedes agregar lógica adicional sincrónica aquí si es necesario
    }


    // Escuchar el evento para recibir los carritos 
    socketClient.on("carritosInicialesRT", (carritosIniciales) => {
        console.log('escuchando el evento carritosInicialesRT en cartsviews')
        //console.log('carritosIniciales en cartsViews.js', carritosIniciales);
        carritos = carritosIniciales.allCarts;
        renderCarts(carritos);
    });

    socketClient.on("cartsUpdated", (carritosActualizados) => {
        console.log('escuchando el evento cartsUpdated en cartsviews')
        //console.log('cartsUpdated en cartsViews.js', carritosActualizados);
        carritos = carritosActualizados.allCarts;
        renderCarts(carritos);
    });

    function renderCartDetail(cartId) {
        console.log('renderCartDetail ID:', cartId);
        // Utiliza async/await para obtener los productos del carrito
        getCartDetail(cartId).then((response) => {
            const productos = response.cartById.products;
            console.log('getCartDetail cartById.productos', productos );    
            const cardContainer = document.createElement("div");
            
            productos.forEach((producto) => {
                
                //console.log('producto.productoId.title', producto.productoId.title)
                //console.log('producto.quantity', producto.quantity)

                const productCardDiv = document.createElement("div");
                productCardDiv.classList = `productCardDiv`;
    
                const productCardTitle = document.createElement("h3");
                productCardTitle.classList = 'productCardTitle';
                productCardTitle.textContent = producto.productoId.title;
                productCardDiv.appendChild(productCardTitle);
    
                const productCardCode = document.createElement("p");
                productCardCode.textContent = `Código: ${producto.productoId.code}`;
                productCardDiv.appendChild(productCardCode);
    
                const productCardCategory = document.createElement("p");
                productCardCategory.textContent = `Categoría: ${producto.productoId.category}`;
                productCardDiv.appendChild(productCardCategory);
    
                const productCardPrice = document.createElement("p");
                productCardPrice.textContent = `Precio: ${producto.productoId.price}`;
                productCardDiv.appendChild(productCardPrice);
    
                const productCardQuantity = document.createElement("p");
                productCardQuantity.textContent = `Cantidad: ${producto.quantity}`;
                productCardDiv.appendChild(productCardQuantity);
    
                const productCardTotal = document.createElement("p");
                productCardTotal.textContent = `Total: ${producto.quantity * producto.productoId.price}`;
                productCardDiv.appendChild(productCardTotal);
    
                cardContainer.appendChild(productCardDiv);
            });
    
            // Usa cartDetailDiv en lugar de productsDiv
            cartDetailDiv.innerHTML = "";
            cartDetailDiv.appendChild(titleDetail);
            cartDetailDiv.appendChild(cardContainer);
        });
    }
    
    async function getCartDetail(cartId) {
        try {
            const response = await fetch(`${baseURL}/api/carts/${cartId}`);
            if (response.ok) {
                const productos = await response.json();
                console.log('getCartDetail en cartsView.js');
                //console.log('getCartDetail productos', productos);
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
    


})