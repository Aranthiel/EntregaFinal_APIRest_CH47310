
console.log("RTP It's alive!");

const socketClient = io();
const form = document.getElementById("productForm");
const div = document.getElementById("showProducts");

const title = document.createElement("h2");
title.textContent = "Productos";

const deleteButton = document.createElement("button");
deleteButton.textContent = "Eliminar Productos";

// Inicializar productos como un arreglo vacío
let productos = [];
//console.log('productos', productos);

// Función para recuperar el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
    
    // Recuperar el token almacenado en la cookie
    const token = getCookie('token');
    
    
    if (!token) {
        // Si no hay un token almacenado, redirigir al usuario al login y mostrar una alerta
        Swal.fire({
            title: 'Debes estar logueado',
            text: 'Para agregar un nuevo producto, debes iniciar sesión',
            icon: 'warning',
            confirmButtonText: 'Ir al login'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir al usuario al login
                window.location.href = '/login';
            }
        });
        return; // Detener la ejecución del código
    }
    
    // Obtener los valores del formulario
    const title = document.getElementById("title").value;
    const code = document.getElementById("code").value;
    const price = parseFloat(document.getElementById("price").value);
    const status = document.getElementById("status").checked;
    const stock = parseInt(document.getElementById("stock").value);
    const category = document.getElementById("category").value;

    // Crear un objeto con los datos del producto
    const nProduct = {
        title,
        code,
        price,
        status,
        stock,
        category,
        limit: 30,
        token, 
    };


    // Enviar el producto al servidor a través de Socket.io
    console.log('Enviando evento "addProduct" con los siguientes datos:', nProduct);
    socketClient.emit("addProduct", nProduct);

    // Limpiar el formulario
    form.reset();
});

//renderizar los productos en el DOM
function renderProducts(productos) {
    console.log('ejecutando renderProducts en realtimeproducts')
    //console.log('productos para renderizar', productos )
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

    div.innerHTML = "";
    div.appendChild(title);
    div.appendChild(ul);
    div.appendChild(deleteButton);
}; // funciona ok 17/02

// Escuchar el evento para recibir los productos iniciales
socketClient.on("productosInicialesRT", (productosIniciales) => {
    console.log(' escuchando el evento productosInicialesRT')
    //console.log('productosIniciales en realtimeproducts.js', productosIniciales);
    productos = productosIniciales.products;
    renderProducts(productos);
}); // funciona ok 17/02

socketClient.on("productsUpdated", (productosActualizados) => {
    console.log(' escuchando el evento productsUpdated')
    //console.log('productsUpdated en realtimeproducts.js', productosActualizados);
    productos = productosActualizados.products;
    renderProducts(productos);
});
    
// Agregar lógica para eliminar productos
deleteButton.addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedProductIds = Array.from(selectedCheckboxes).map((checkbox) => {
        return checkbox.id.replace("checkbox_", "");
    });

    // Recuperar el token almacenado en la cookie
    const token = getCookie('token');
    console.log('token', token)

    const confirmation = Swal.fire({
        title: '¿Quieres borrar esto?',
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
            console.log('Enviando evento "borrar" con los siguientes datos:', selectedProductIds);
            socketClient.emit("borrar", selectedProductIds, token);

            // Desmarcar las checkbox
            selectedCheckboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        }
    });
});