// const authLogger = (req, res, next) => {
//     console.log("Todo lo que pase por auth pasa por acá.");
//     next();
// };

const validateData = async (req, res, next) => {
    const { name, lastname, email, username, password, ... extraProp} = req.body;
    if (!name || !lastname || !email || !username || !password) {
        console.log(`Falta data (${req.body})`);
        return res.status(404).json({
            msj: "Falta data."
        });
    }
    if (Object.keys(extraProp).length > 0) {
        return res.status(404).json({
            msj: "No se pueden agregar otra data."
        });
    }
    console.log("middleware validateData");
    next();
}

module.exports = { /* authLogger, */ validateData };