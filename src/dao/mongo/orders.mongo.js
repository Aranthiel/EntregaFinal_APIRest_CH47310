import { orderModel } from '../../models/orders.model.js';
import {BasicMongo} from './basic.mongo.js';

export class OrdersMongo extends BasicMongo{
    constructor(){
        super(orderModel);
    }
    
    async findAllAndLimit(limit){
        return orderModel.find().limit(limit);
    };
}