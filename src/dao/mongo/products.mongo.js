import { productModel } from '../../models/products.model.js';
import {BasicMongo} from './basic.mongo.js';

export class ProductsMongo extends BasicMongo{
    constructor(){
        super(productModel);
    }
    
    async findAllAndLimit(limit){
        return productModel.find().limit(limit);
    };
}