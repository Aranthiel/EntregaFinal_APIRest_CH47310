import winston from 'winston';

//DEFAULT WINSTN LEVES
/*
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};
*/

//Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
//Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
//Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG


const myCustomLevels ={
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,
        test:6,
    },
    colors: {
        fatal:"cyan",
        error:"yellow",
        warning:"red",
        info:"magenta",
        http:"blue",
        debug :"green",
        test :"grey",
        //poor:"white",
    }
}

export const myCustomLogger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports:[
        new winston.transports.Console({
            level:'info',  // EJECUTA SOLO LOS LOGS= o MAYORES AL NIVEL SELECCIONADO
            format: winston.format.combine(
                winston.format.colorize({colors:myCustomLevels.colors}),
                winston.format.simple()), // le asigna colores             
        }),
        new winston.transports.File({ //Guarda los logs de nivel >? 2 warn"en un archivo
            filename:'./errors.log',
            level:'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(), //este va al ultimo de todo, si es que lo ponemos
            )
        })
    ]
});