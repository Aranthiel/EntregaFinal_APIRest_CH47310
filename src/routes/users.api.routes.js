import {Router} from 'express';
import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser, 
    deleteUser, 
} from '../controllers/users.controller.js'
import { validateUserCreation, checkDuplicateEmail} from '../middleware/userValidation.middleware.js'
import authenticateToken from '../middleware/authenticateToken.middleware.js';

const apiUsersRouter = Router();

//endpopint GET para obtener TODOS LOS UserOS
apiUsersRouter.get('/', getAllUsers); 

//endpopint GET para obtener un UserO POR SU ID
apiUsersRouter.get('/:userId', getUserById); 

//endpopint GET para obtener un UserO POR SU ID
apiUsersRouter.get('/email/:userEmail', getUserByEmail); 

//Endpoint POST para APGREGAR UserO
apiUsersRouter.post('/', validateUserCreation, checkDuplicateEmail, addUser ); 

//Endpoint PUT para actualizar un Usuario por su ID
apiUsersRouter.put('/:userId', authenticateToken, updateUser );

//Endpoint DELETE para eliminar un Usero por su ID
apiUsersRouter.delete('/:userId', authenticateToken, deleteUser );

apiUsersRouter.get("/userTest", async (req, res) => {
    console.log(req)
    res.status(404).send('Se encontró la ruta /api/userTest ')
    //res.status(404).send('Se encontró la ruta /api/userTest ').json({ success: true, message: 'Se encontró la ruta /api/userTest '})     
});

export default apiUsersRouter;