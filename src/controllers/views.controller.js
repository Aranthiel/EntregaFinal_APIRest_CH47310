import config from '../configs/config.js';
import {productsPersistence} from '../configs/persistenceManager.js';
//winston 
import {myCustomLogger} from '../configs/configWinston.js'


const baseURL= config.baseURL;

async function renderHome(req,res){
    myCustomLogger.test('ejecutando renderHome en views.controller.js');
    myCustomLogger.test('req.session de renderHome en views.controller.js', req.session)
    const { email, first_name, cart }= req.session || "";
    myCustomLogger.test('Datos antes de renderizar:', { email, first_name, cart }); // Agrega esta línea
    res.render("home", {baseURL, email, first_name, cart });
};

async function renderSignup(req,res){
    myCustomLogger.test('ejecutando renderSignup en views.controller.js'); 
    const { email, first_name, cart }= req.session || "";
    res.render("signup", {baseURL, email, first_name, cart });
};

async function renderLogin(req,res){
    myCustomLogger.test('ejecutando renderLogin en views.controller.js'); 
    const { email, first_name, cart }= req.session || "";
    res.render("login", {baseURL, email, first_name, cart });
};

async function renderCartDetail(req,res){
    myCustomLogger.test('ejecutando renderCartDetail en views.controller.js');
    const { email, first_name, cart }= req.session || "";
    res.render("cartDetail", {baseURL, email, first_name, cart });

};

async function renderProductDetail(req,res){   
    myCustomLogger.test('ejecutando renderProductDetail en views.controller.js');
    const productId = req.params.pid;
    myCustomLogger.test('req.params.pid', productId)
    const { email, first_name, cart }= req.session || "";
    res.render("productDetail", {baseURL, email, first_name, cart });

};

async function renderChat(req,res){
    myCustomLogger.test('ejecutando renderChat en views.controller.js');
    const { email, first_name, cart }= req.session || "";
    res.render("chat", {baseURL, email, first_name, cart });
};

async function renderRealTimeProducts(req,res){
    myCustomLogger.test('ejecutando getRealTimeProductsC en views.controller.js');
    const { email, first_name, cart }= req.session || "";
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;   
    
    try {
        const products = await productsPersistence.findAllAndLimit(limit);
        if (!products.length){
            res.status(404).json({ success: false, message: 'No se encontraron productos' , data:[]})
        } else {
            res.status(200).render("realTimeProducts", {baseURL, email, first_name, cart, products});
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
};






export {
    renderHome,
    renderSignup,
    renderLogin,
    renderChat,
    renderRealTimeProducts,
    renderCartDetail,
    renderProductDetail,
}

