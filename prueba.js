async function passportLocalAuthSignup(req, res, next) {
    console.log('/api/auth/passportsignup is alive');
    
    passport.authenticate('plocalsignup', async (err, user, info) => {
        try {
            if (err) {
                myCustomLogger.error(err);
                //return res.redirect('/error'); // Manejar errores de autenticación
                return res.status(400).json({ success: false, message: 'El usuario no pudo ser registrado' });
            }
            if (!user) {
                // Manejar el caso de usuario no creado debido a un error o ya existente
                //return res.redirect('/signup'); // Redireccionar a página de signup
                return res.status(404).json({ success: false, message: 'No se pudo agregar el usuario solicitado', redirectto: `${baseURL}/signup` });
        
            }
            // Llamar a passportLocalAuthLogin para iniciar sesión automáticamente después del registro
            await passportLocalAuthLogin(req, res);
        } catch (error) {
            myCustomLogger.error(error);
            //res.redirect('/error'); // Manejar errores internos
            return res.status(500).json({ success: false, message: 'Se producjo un error', error: error.message, redirectto: `${baseURL}/error` });
        }
    })(req, res, next);
}

async function passportLocalAuthLogin(req, res, next) {
    console.log('/api/auth/passportlogin is alive');
    passport.authenticate('plocallogin', async (err, user, info) => {        
        try {
            if (err) {
                console.log("error1")
                myCustomLogger.error(err);
                //return res.redirect('/error'); // Manejar errores de autenticación
                return res.status(400).json({ success: false, message: 'Credenciales incorrectas' });
            }
            console.log("!user", !user)
            if (!user) {
                // Manejar el caso de credenciales incorrectas o usuario inexistente
                //return res.redirect('/login'); // Redireccionar a página de login
                return res.status(400).json({ success: false, message: 'Credenciales incorrectas',  redirectto: `${baseURL}/login` });
            } else {

            // Almacenar información del usuario en la sesión          
            req.session._id= user._id,
            req.session.first_name= user.first_name,
            req.session.last_name= user.last_name,
            req.session.email= user.email,
            req.session.cart= user.cart,
            // Otras propiedades del usuario si son necesarias
           
            console.log('session')

            // Establecer la cookie con la información del usuario
            res.cookie('userInfo', req.session, { maxAge: 900000, httpOnly: true });
            res.cookie('_id,', user._id, {maxAge:900000, httpOnly:true});
        res.cookie('first_name,', user.first_name, {maxAge:900000, httpOnly:true});
        res.cookie('last_name,', user.last_name, {maxAge:900000, httpOnly:true});
        res.cookie('email,', user.email, {maxAge:900000, httpOnly:true});
        res.cookie('cart,', user.cart, {maxAge:900000, httpOnly:true});
            console.log('cookie')
            console.log('redirect')
            console.log(`${baseURL}/home`)

            res.redirect(`${baseURL}/home`);
            //return res.status(200).json({ success: true, message: 'Ingreso exitoso',  redirectto: `${baseURL}/home` });
            }   
        } catch (error) {
            console.log('error2')
            myCustomLogger.error(error);
            //res.redirect('/error'); // Manejar errores internos
            return res.status(500).json({ success: true, message: 'Credenciales incorrectas',  error: error.message, redirectto: `${baseURL}/error`});
        }
    })(req, res, next);
}