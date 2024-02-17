async function updateCartProducts(cartId, products){
    //obtener los productos actuales del carrito por su id
   
    try {
        const carritoDB = await cartsService.getCartById(cartId);
        
            
        
        
            
        // Crear un objeto que mapee cada producto por su ID
        const currentProductsMap = {};
        carritoDB.products.forEach(product => {
            if (product.productId) { // Verificar si el productId está definido
                currentProductsMap[product.productId] = product.quantity;
            }
        });

        // Iterar sobre los productos nuevos y actualizar el mapa de productos actuales
        products.forEach(product => {
            if (product.productId) { // Verificar si el productId está definido
                currentProductsMap[product.productId] = product.quantity;
            }
        });
        

        // Crear un nuevo array con los objetos de productos y cantidades actualizadas
        const updatedProducts = Object.keys(currentProductsMap).map(productId => ({
            productId,
            quantity: currentProductsMap[productId]
        }));
        
        
        const updatedCart = await cartsService.updateCart(cartId, updatedProducts);
        return updatedCart
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        throw error;
    }
}