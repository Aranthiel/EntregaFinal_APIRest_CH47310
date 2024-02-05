import fs from 'fs/promises';
import {myCustomLogger} from '../../configs/configWinston.js'

export async function writeDataToFile(path, data) {
  try {
    // Escribir en el archivo
    await fs.writeFile(path, JSON.stringify(data, null, 2));
    myCustomLogger.info(`Datos escritos en ${path} correctamente.`);
  } catch (error) {
    throw new Error(`Error al escribir en el archivo ${path}: ${error.message}`);
  }
}
