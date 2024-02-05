import {Schema, model} from "mongoose";
//crear esquema
const chatSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    message:{
        type: String,
        required:true
    }
});


//crear modelo
export const chatModel = model('Chat', chatSchema);

