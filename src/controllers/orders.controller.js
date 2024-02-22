
import { ordersService } from '../services/orders.service.js'; 

async function createOrder(req, res){
    const orderInfo= req.body 
    try {
        const newOrder = await ordersService.createOrder(orderInfo)
        if (newOrder instanceof Error){
            res.status(404).json({ success: false, message: 'No se pudo confirmar la orden solicitado'});
        return newOrder; 
        } else {
            res.status(200).json({success: true, message: 'orden agregado con éxito:', newOrder});
            }
    } catch (error) {
        res.status(500).json({success: false, message:error.message})
    }
}
async function getOrderById(req, res){
    const {orderId}=req.params;
    try {
        const orderByEmail = await ordersService.getOrderById(orderId);
        if (orderByEmail){
            res.status(200).json({success: true, message: 'orden encontrado con éxito:', orderByEmail})
            return orderByEmail;
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de orden solicitado'})
        }
    } catch (error) {
        res.status(500).json({success: false, message:error.message})
    }
}

async function updateOrder(req, res){
    const {orderId}=req.params;
    const newValues= req.body; 
    try {
        const response = await ordersService.updateOrder(orderId, newValues);
        
        if(response != null){
            res.status(200).json({success: true, message: 'orden actualizado con éxito:', response});
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de orden solicitado'});
        }
    } catch (error) {
        res.status(500).json({success: false, message:error.message})
    }
}
async function deleteOrder(req, res){
    const {orderId}=req.params;
    try {
        const deletedorder = await ordersService.deletOorder(orderId);
        if (deletedorder) {
            res.status(200).json({success: true, message: 'orden eliminado con éxito:', deletedorder}); 
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el Id de orden solicitado'});
        }
    } catch (error) {
        res.status(500).json({success: false, message:error.message})
    }
}

export {
    createOrder,
getOrderById,
updateOrder,
deleteOrder
}