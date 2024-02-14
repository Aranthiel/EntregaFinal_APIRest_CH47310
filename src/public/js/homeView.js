console.log('homeView is Alive!')

// Función para obtener los datos del usuario del Local Storage y mostrarlos en la página
function displayUserInfo() {
    const userData = JSON.parse(localStorage.getItem('APIuser'));
    if (userData) {
        console.log('displaying UserInfo')
        document.getElementById('first-name').textContent = userData.first_name;
        document.getElementById('email').textContent = userData.email;
        document.getElementById('cart-id').textContent = userData.cart;
        console.log('userData..first_name', userData.first_name)
        console.log('userData..cart', userData.cart)
        console.log('userData.email', userData.email)
    }
} 
const baseURL = "http://localhost:8080";
function fetchProducts() {
    return fetch(`${baseURL}/api/products`)
        .then(response => response.json())
        .then(data => data.products)
        .catch(error => {
            console.error('Error al obtener productos:', error);
            return []; // Devolver un array vacío si hay un error
        });
}

function renderProductCard(product) {
	const productCard = document.createElement('div');
	productCard.classList.add('product-card');

	const productImage = document.createElement('div');
	productImage.classList.add('product-image');
	const image = document.createElement('img');
	image.src = product.tumbnail || 'https://placehold.co/200/74c1c4/69888a?text=Hello\nWorld'; // Asignar la imagen del producto
	productImage.appendChild(image);

	const productInfo = document.createElement('div');
	productInfo.classList.add('product-info');

	const titleContainer = document.createElement('div');
	titleContainer.classList.add('title-container');
	const title = document.createElement('h2');
	title.textContent = product.title; // Agregar el título del producto
	titleContainer.appendChild(title);

	const descriptionContainer = document.createElement('div');
	descriptionContainer.classList.add('description-container');

	const category = document.createElement('p');
	category.textContent = `Categoría: ${product.category}`; // Agregar la categoría del producto

	const code = document.createElement('p');
	code.textContent = `Código: ${product.code}`; // Agregar el código del producto

	const price = document.createElement('p');
	price.textContent = product.price; // Agregar el precio del producto

	// Agregar elementos category, code y price al contenedor de descripción
	descriptionContainer.appendChild(category);
	descriptionContainer.appendChild(code);
	descriptionContainer.appendChild(price);

	const actionsContainer = document.createElement('div');
	actionsContainer.classList.add('actions-container');

	const viewDetailsBtn = document.createElement('button');
	viewDetailsBtn.textContent = 'Detalles';
	viewDetailsBtn.setAttribute('id', 'viewProductDetailsBtn'); 
	viewDetailsBtn.dataset.productId = product._id; 
	viewDetailsBtn.addEventListener('click', handleDetailsClick);



	const addToCartBtn = document.createElement('button');
	addToCartBtn.textContent = 'Agregar'; 
	addToCartBtn.setAttribute('id', 'addProductToCartBtn');
	addToCartBtn.dataset.productId = product._id; 
	addToCartBtn.addEventListener('click', handleAddToCartClick);


	// Agregar botones al contenedor de acciones
	actionsContainer.appendChild(viewDetailsBtn);
	actionsContainer.appendChild(addToCartBtn);

	// Agregar contenedores al contenedor principal de la información del producto
	productInfo.appendChild(titleContainer);
	productInfo.appendChild(descriptionContainer);
	productInfo.appendChild(actionsContainer);

	// Agregar elementos al producto
	productCard.appendChild(productImage);
	productCard.appendChild(productInfo);

	return productCard; // Devolver el elemento creado
}  

function renderProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ''; // Limpiar la lista antes de renderizar

    products.forEach(product => {
        const productCard = renderProductCard(product);
        productList.appendChild(productCard);
    });
}

window.addEventListener('load', async function() {
    try {
        console.log('displayUserInfo')
        displayUserInfo();
        const products = await fetchProducts(); // Obtener productos usando la función
        renderProducts(products); // Renderizar productos
    } catch (error) {
        console.error('Hubo un error:', error);
    }
});

function handleDetailsClick(event) {
    const productId = event.target.dataset.productId;
    console.log(`Se hizo clic en Detalles del producto con ID ${productId}`);
    
    window.location.href = `/products/${productId}`;
}

async function handleAddToCartClick(event) {
    const productId = event.target.dataset.productId;   

    // Obtener información del usuario del Local Storage
    const userData = JSON.parse(localStorage.getItem('APIuser'));
    
    // Obtener el carrito almacenado en el Local Storage
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    
    let currentCartId
    let currentUserId

    if(userData === null){
        //si no hay usuario guardado en localSrotage, definimos el id del usuario como "nouser"
        currentUserId = "nouser";
        if(storedCart ===null){
            //si tampoco hay almacenado un carrito, definimos el id como null
            currentCartId = null
        } else {
            //si hay un carrito ya almacenado, tomamos el id
            currentCartId = storedCart.cart;
        }
    } else {
        //si hay usuario guardado en local stogae, sacamos la info del usrId y cart Id de ahi
        currentCartId = userData.cart;
        currentUserId = userData._id;
    } 
    
    let actionUrl;
    let method;

    if(currentCartId === null){
        actionUrl = `/api/carts/addproduct/${currentUserId}`;
        method = "POST";
        
    } else {
        actionUrl = `/api/carts/${currentCartId}`;
        method = "PUT";
    }
    console.log(`se va a realizar una peticion ${method} a la URL ${actionUrl}`)
    
    try {
        const response = await fetch(actionUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: [
                    {
                        productId: productId,
                        quantity: 1
                    }
                ]
            })
        });

        if (response.ok) {
            // El producto se agregó o actualizó en el carrito exitosamente
            const responseData = await response.json();
            const carritoUsuario = responseData.carritoUsuario;
            console.log('Carrito del usuario:', carritoUsuario);

            // Actualizar el carrito almacenado en el Local Storage
            localStorage.setItem('cart', JSON.stringify({ cart: carritoUsuario._id }));
        } else {
            console.error('Error al agregar o actualizar el producto en el carrito:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud fetch:', error);
    }
}


