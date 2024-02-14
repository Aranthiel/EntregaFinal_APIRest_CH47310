import {dirname} from 'path';
import {fileURLToPath} from 'url';
import bcrypt from "bcrypt";

export const __dirname = dirname(fileURLToPath(import.meta.url));

//

// bcrypt
export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
}; 

export async function pruebaHasheo(contraseña){
    const hashed = await hashData(contraseña);
    console.log (hashed);
    const match = await compareData(contraseña, hashed);
    console.log('prueba hasheo match', match);
}

//console.log(await compareData("123456", "$2b$10$xTQOwCys9AJw0tzoF7HnF.yZaGuz8qG/6F4qJEfV9QpvtU79kERau"))