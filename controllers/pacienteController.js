import Paciente from "../models/Paciente.js";

//TODO: #10.1
const agregarPaciente = async (req, res) => {

    const paciente = new Paciente(req.body);  //nos va a generar el obj paciente con la info que se le paso
    paciente.veterinario = req.veterinario._id // nos va atrear los datos del paciente y el id veterinario.
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log("Hoo algo salio mal ",error);
    }
};

//VA A UTENTICAR, Y VA ATRAER TODOS LOS PACIENTES DE DICHO VETERINARIO.
const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);

    res.json(pacientes);
};

//Vamos a obtener datos por el id de forma individual.
const obtenerPaciente =  async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({msg: "No Encontrado"});
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida"});
    }

    res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({msg: "No Encontrado"});
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida"});
    }

    //ACTUALIZAR PACIENTE.
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
    
    

};

const eliminarPaciente = async (req, res) => {
    //AKI ESTA VERIFICANDO QUE LA PERSONA QUE REGISTRO EL PACIENTE SEA QUIE VALLA A ELIMINAR, Y NO OTRA
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({msg: "No Encontrado"});
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida"});
    }
    //**********************************/
    try {
        await paciente.deleteOne();
        res.json({ msg: "Paciente Eliminado"});
    } catch (error) {
        console.log();
    }


};


export { agregarPaciente, 
    obtenerPacientes, 
    obtenerPaciente, 
    actualizarPaciente, 
    eliminarPaciente,
};