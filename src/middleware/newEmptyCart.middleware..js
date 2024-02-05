import {cartsPersistence} from '../configs/persistenceManager.js';
//winston 
import {myCustomLogger} from '../configs/configWinston.js'


export const newEmptyCart = async (req, res, next) =>{
    const emptyCart = {
        products: []  
    };
    try {
        const newCart= await cartsPersistence.createOne(emptyCart);
        console.log('newCart in newEmptyCart middleware', newCart._id)
        return newCart._id;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

