import Veterinario from "../models/Vaterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

//TODO: #6.1 CREAMOS NUESTRO CONTROLADOR. el res.send muestar por pantalla.
const registrar = async (req, res) => {
    //TODO:#7.2PREVENIR USUARIOS DUBPLICADOS POR CORREO
    const{email, nombre} = req.body;
    //vamos a consultar a la BD para revisar si existe ese usuario y despues consultamos para almacenar en caso de que no este.
    //findOne permite buscar por los diferentes atrivutos de cada uno de los registros.
    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    //TODO:#7.1 ALMACENAMOS REGISTRO EN LA BD try Catch
    try {
        //Guardar un Nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar Email para confirmar cuenta
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        }); //primero debe confriamr en el email para acceder al login
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
};

//TODO: #7.5 confirmamos si el token existe o no para verificar la cuenta.
const confirmar = async (req, res) => {
    //console.log(req.params.token); //cuando leemos datos de la url usamos req.params.
    const { token } = req.params
    const usuarioConfirmar = await Veterinario.findOne({token})
    
    if(!usuarioConfirmar){
        const error = new Error('token no valido')
        return res.status(404).json({msg: error.message})
    }
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente.'})
    } catch (error) {
        console.log(error);
    }
};
//TODO: #8.1 Login autenticar.
const autenticar = async (req, res) => {
    const { email, password } = req.body;
    //Comprobar si el usuario existe.
    const usuario = await Veterinario.findOne({email})
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    //Comprobar si el usuario esta confrmado.
    if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    //TODO: #8.3 Revisar el password
    if ( await usuario.comprobarPassword(password)) {
        //AUTENTICAR
        //usuario.token = generarJWT(usuario.id)
        //Autenticar instalamos la dependencia npm i jsonwebToken
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });

    }else{
        const error = new Error('El password Incorrecto');
        return res.status(403).json({msg: error.message});
    }
};

//TODO: #9.2 PASO
const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({email})
    if (!existeVeterinario) {
        const error = new Error("El Usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar Email con instruciones pra generar nueva password
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: "Hemos enviado un email con las instrucciones." })
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({token});

    if (tokenValido) {
        //El token es valido el usuario existe.
        res.json({ msg: "Token valido y el usuario existe" });
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }
}

const nuevoPassword = async (req, res) => {
    //body es lo qeu el user escriba. params es la url
    const {token} = req.params;
    console.log(token);
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if (!veterinario) {
        const error = new Error("Hubo un ERROR.");
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "Password modificado correctamente. "});

    } catch (error) {
        console.log(error);
    }

}

const actualizarPerfil = async (req, res) => {
    //esta buscando el veterinario que, queremos editar, de esta forma obtenemos la informacion
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email})
        if (existeEmail) {
            const error = new Error('El Email ya existe.')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email ;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    //leer los datos
    const {id}=req.veterinario
    const {passwordActual, nuevaPassword} = req.body
    //comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }
    //comprobar su password
    if (await veterinario.comprobarPassword(passwordActual)) {
        //almacenar el nuevo password
        veterinario.password = nuevaPassword;
        await veterinario.save();
        res.json({msg: 'Password Almacenado Correctamente.'})
    } else {
        const error = new Error("El password Actual es Incorrecto.");
        return res.status(400).json({msg: error.message});
    }

};

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};