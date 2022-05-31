import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Hashear passwrod mayor seguridad
import generarId from '../helpers/generarId.js';

//TODO:#4 Creamos nuestro ESQUEMA, Modelo
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId(), //TODO: #7.4 este nos va agenerar un token unico.
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
});

//TODO: #8 hashear password
veterinarioSchema.pre("save", async function (next) {
    //Esto que para que un password q esta hasheado no lo vuelva a hashear.
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10); //rondas de hassear si aumentamos el servidor sonsume mas recursos.
    this.password = await bcrypt.hash(this.password, salt) //el salt lo va hashear.
})

//TODO: #8.2 metodo que solo se ejecutaran en este modelo indicado.
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password) //compara la passwordFormulario sin hashear con la hasheada this.password y revisa que sean las mismas.
}


//Lo registramos en mongo como modelo con al siguiente linea de code.
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;