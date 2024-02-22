import mongoose, { Schema, model } from "mongoose";


// Crear esquema
const orderSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Usuarios', // Nombre de la colección a la que haces referencia
        // en products.model.js: export const productModel = model('Producto', productSchema);
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Carritos', // Nombre de la colección a la que haces referencia
        // en cart.model.js: export const cartModel = model('Carritos', cartSchema);   
    } , 
    payment :{
        type: String,
        default: "reservation",
        required: true
    },
    date: {
        type: Date
    }
});


// Crear modelo
export const orderModel = model('Ordenes', orderSchema);
