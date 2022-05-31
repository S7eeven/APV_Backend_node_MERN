//TODO:#1CREAMOS NUESTRO SERVIDOR CON EXPRESS
import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
app.use(express.json()); //TODO: #6.2 DE ESTA FORMA LE INDICAMOS QUE LE VAMOS A ENVIAR DATOS DE TIPO Json
dotenv.config(); //de esta forma va aescanear y a buscar el archivo .env
conectarDB();


//TODO: CORS PARA QUE FUNCIONE JUNTO AL FRONTEND //utilizando variables de entorno .env en backen y forntend

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            //-1 es que no, no encontro, El origen del request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
};

//le indicamos a expres que queremos utilizarlas.
app.use(cors(corsOptions));


//TODO:#3 Creamos un arcbivo .env => VARIABLE DE ENTORNO DONDE GUARDARA NUESTRA CADENA DE CONEXION A MONGO ATLAS Y COMPASS.
/* instalamos padependencia npm i dotenv paar que nos permita leer el archivo .env */
console.log(process.env.MONGO_URI);

/*req en lo en enviamos al servidor, res es lo que el servidor nos responde. 
app.use('/') es como la ruta inicial.*/
//TODO:#5.2 Rutas => cuando yo visite /api/veterinario nos llevara ala ruta indicada en veterinarioRoutes
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servido funcionando en el puerto: ${PORT}`);
});
