import { userModel } from '../../models/users.models.js';
import { BasicMongo} from './basic.mongo.js';

 export class UsersMongo extends BasicMongo{
    constructor(){
        super(userModel);
    }

    async findByEmail( email ){
        //console.log('email: ', email)
        const userByEmail = await userModel.findOne({email});
        //console.log ('userByEmail en user.mongo.js', userByEmail)
        return  userByEmail
    }
}

