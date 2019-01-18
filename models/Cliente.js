const mongoose = require("mongoose");

const Cliente = new mongoose.Schema({
    nombre: { type:String, trim:true },
    apellido: { type:String, trim:true },
    dni: Number ,
    nota: Number,
    direccion : { type:String, trim:true }
});

module.exports = mongoose.model("Cliente", Cliente);