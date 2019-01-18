const mongoose = require("mongoose");
const Cliente = require("./Cliente.js").schema;
const Curso = new mongoose.Schema({
    anio_dictado:  { type: Date},
    duracion: Number ,
    tema: { type:String},
    alumnos : { type:[Cliente],default:[]}
});

module.exports = mongoose.model("Curso", Curso);