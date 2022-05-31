import mongoose from 'mongoose';

//TODO:#2CONFIGURAMOS AL CONEXION CON MONGODN ATLAS es nuestro servidor.
const conectarDB = async () => {
    //process.env.MONGO_URI TODO: #3
    try {
        const db = await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        );
        //ESTO NOS VA A DAR LA URL Y EL PUETO POR EL CUAL SE ESTA CONECTANDO.
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB Atlas conectado en: ${url}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}
export default conectarDB;