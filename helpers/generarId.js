//TODO: 7.3 para no sobrecargar al modelo.
const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2); //nos va agenerar un token(id) mas complejo, substring(2) => eliminas los 2 primeros numeros.
};
export default generarId