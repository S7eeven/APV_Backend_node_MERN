import express from "express";
import {perfil, registrar, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

//TODO:#5.1 CREAMOS NUESTARS RUTAS.
const router = express.Router();

//AREA PUBLICA
router.post("/", registrar );
router.get('/confirmar/:token', confirmar);
router.post("/login", autenticar);
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

//AREA PRIVADA
router.get('/perfil', checkAuth,  perfil); //parte del paso 9.1 de aki va al authMiddleware para verificar ejecuta el codigo y con el net pasa al siguiente q es perfil ejecuta el codigo.
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;