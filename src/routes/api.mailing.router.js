import {Router} from 'express';
import { transporter } from '../configs/nodemailerConfig.js';


const apiMailingRouter = Router();

//endpopint POST  para enviar maiol de confirmacion
apiMailingRouter.post('/', async (req, res) => {
    console.log('req.body', req.body);

    const {
        userEmail,
        userName,
        payment,
        date,
        orderId,
        products,
        total
    } = req.body;

    // Construir el cuerpo del correo electrónico con la información proporcionada
    const emailBody = `
        <h2>Detalles de la Orden</h2>
        <p><strong>Usuario:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Payment:</strong> ${payment}</p>
        <p><strong>Productos:</strong></p>
        <ul>
            ${products.map(product => `<li>${product.name} - Cantidad: ${product.quantity} - Precio: ${product.price}</li>`).join('')}
        </ul>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
    `;

    try {
        await transporter.sendMail({
            from: 'Aranthiel" <nmoronidalmasso@gmail.com>',
            to: userEmail,
            subject: "Confirmación de Orden",
            html: emailBody,
        });
        res.send('Se envió un correo electrónico con la confirmación de la orden.');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).send('Ocurrió un error al enviar el correo electrónico.');
    }
});


export default apiMailingRouter;