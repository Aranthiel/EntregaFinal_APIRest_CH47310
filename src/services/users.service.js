//import {usersMongo} from '../dao/mongo_dao/users.mongo';
import {usersPersistence} from '../configs/persistenceManager.js';
import { hashData }from '../utils.js';

class UsersService{
    async getAllUsers(){
        //console.log('ejecutando getAllUsers en users.service.js');
        try {
            const response = await usersPersistence.findAll()
            return response;
        } catch (error) {
            console.error('No se encontraron usuarios', error);
            return error;
        }
    };

    async getUserById(id){        
        //console.log('ejecutando getUserById en users.service.js');
        try {
            const response = await usersPersistence.findById(id)
            return response
        } catch (error) {
            console.error('No se encontró el usuario solicitado', error);
            return error;            
        };
    };

    async getUserByEmail(email){
        //console.log('email: ', email)
        //console.log('ejecutando getUserByEmail en users.service.js');
        try {
            const response = await usersPersistence.findByEmail( email );
            
            return response;
        } catch (error) {
            console.error('No se encontró el usuario solicitado', error);
            return error;
        }
    }
    
    async createUser(obj) {
        //console.log('ejecutando createUser en users.service.js');
        const {password} = obj; 
        try {
            const hashedPassword= await hashData(password);
            const response = await usersPersistence.createOne({...obj, password:hashedPassword,});
            console.log('Usuario creado con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return error;
        }
    }

    async updateUser(id, obj) {
        //console.log('ejecutando updateUser en users.service.js');
        try {
            const response = await usersPersistence.updateOne(id, obj);
            console.log('Usuario actualizado con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return error;
        }
    }

    async deleteUser(id) {
        //console.log('ejecutando deleteUser en users.service.js');
        try {
            const response = await usersPersistence.deleteOne(id);
            console.log('Usuario actualizado con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return error; 
        }
    }    
}

export const usersService = new UsersService();