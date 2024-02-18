import passport from "passport";
import { usersService } from '../services/users.service.js';
import { newEmptyCart } from "../middleware/newEmptyCart.middleware..js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "../utils.js";
import jwt from 'jsonwebtoken';
//variables de entorno
import config from './config.js'

// PASSPORT LOCAL
passport.use(
    "signup",
    new LocalStrategy(
    {
        usernameField: "email",
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            
            // Verifica si el correo electrónico ya está registrado
            const user = await usersService.getUserByEmail( email );
            
            if (user) {
                return done(null, false);
            }
            const userInfo= req.body 
            
    
            const emptyCartId= await newEmptyCart();    
            const nuevoUsuario = {
                ...userInfo,  // Spread properties of userInfo
                cart: emptyCartId // Add cartId property
            };
            
            const usuarioAgregado = await usersService.createUser(nuevoUsuario);
            
            done(null, usuarioAgregado);
        } catch (error) {
        done(error);
        }
    }
    )
);

passport.use(
    "login",
    new LocalStrategy(
    {
        usernameField: "email",
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        console.log('passporLogin')
        try {
        const user = await usersService.getUserByEmail(email);
        
        
        if (!user) {
            return done(null, false);
        }
        const isValid = await compareData(password, user.password);
        

        if (!isValid) {
            return done(null, false);
        }
        
        done(null, user);
        } catch (error) {
        done(error);
        }
    }
    )
);

// PASSPORT GTHUB
passport.use(
    'github', new GithubStrategy (
        {
            clientID: config.ghithub_client_id,
            clientSecret: config.github_client_secret,
            callbackURL: config.github_callback_url,
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('github strategy on passport config')
            try {
                // Verifica si el correo electrónico ya está registrado
                const user = await usersService.getUserByEmail( profile._json.email );
                
                //login
                if (user) {
                    if (user.from_github) {
                        // Si el usuario ya existe y es de GitHub, se autentica sin modificar la sesión
                        return done(null, user);
                    } else {
                        // Si el usuario ya existe y NO es de GitHub, se rechaza la autenticacion                        
                        return done(null, false);
                    }
                }

                //signup
                const emptyCartId= await newEmptyCart()  
                

                const userInfo={
                    first_name:profile._json.login,
                    last_name:profile._json.login,
                    email:profile._json.email,
                    cart: emptyCartId,
                    from_github: true,
                    password:'fromgithub'
                }
                
                const usuarioAgregado = await usersService.createUser(userInfo);
                done(null, usuarioAgregado);
            } catch (error) {
                done(error);
            }
        }
    )
)


// configuracion necesaria para passport
passport.serializeUser(function (user, done) {    
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    try {
    const user = await usersService.getUserById(id);
    done(null, user);
    } catch (error) {
    done(error);
    }
});