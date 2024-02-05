import {Router} from 'express';

const apiUsersAuth = Router();

apiUsersAuth.get("/authTest", async (req, res) => {
    console.log(req.body)
    res.status(200).send('Se encontró la ruta /api/authTest ')
    
    //res.status(200).send('Se encontró la ruta /api/authTest ').json({ success: true, message: 'Se encontró la ruta /api/authTest '})  
});

export default apiUsersAuth;