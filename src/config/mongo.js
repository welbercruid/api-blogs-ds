const mongoose = require('mongoose');
const config = require('./config');

const dbConnect = () => {
    mongoose.connect(config.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("--- MongoDB CONECTADO ---"))
    .catch(err => console.error("ERROR DE CONEXIÓN: ", err))
};

module.exports = { dbConnect }