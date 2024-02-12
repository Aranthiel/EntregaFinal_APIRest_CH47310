console.log('homeView is Alive!')
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
    const currentCartId = document.getElementById('cartId').dataset.cartid;

    console.log(`Se hizo clic en Agregar al carrito ${currentCartId} el producto con ID ${productId}`);

    const updateCartUrl = `/api/carts/${currentCartId}`;
    console.log('updateCartUrl', updateCartUrl)
    if (updateCartUrl === '/api/carts/'){
        console.log('hay que crear un carrito')
        console.log(document.cookie);
        
        //apiCartsRouter.post('/:userId', addCart ); 
    }

    try {
        const response = await fetch(updateCartUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: [
                    {
                        productoId: productId,
                        quantity: 1
                    }
                ]
            })
        });

        if (response.ok) {
            // El producto se agregó al carrito exitosamente
            console.log('Producto agregado al carrito exitosamente.');
            // Puedes hacer algo aquí después de agregar el producto al carrito si es necesario
        } else {
            console.error('Error al agregar el producto al carrito:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud fetch:', error);
    }
}

