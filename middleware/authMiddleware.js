import jwt from "jsonwebtoken";
import Veterinario from "../models/Vaterinario.js";

// TODO: #9.1 PARA RESTRINGUIR CIERTAS AREAS DE MI APP.
const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]; //el token va hacer la posicion 1 y la posicion 0 el bearr
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); //de esta forma me va atraer todo ecepto el password

           return next();
        } catch (error) {
            const e = new Error('Token no valido');
            res.status(403).json({msg: e.message});
        }
    }

    if (!token) {
        const error = new Error('Token no valido o inexistente');
        return res.status(403).json({msg: error.message});
    }

    next(); //ESTO HARA QUE SE VALLA AL SIGUIENTE MIDDLEWARE Y NO SE QUEDE ATASCADO
};

export default checkAuth;