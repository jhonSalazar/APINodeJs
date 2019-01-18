
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
/* GET home page.
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Cursos' });
});
*/
router.use(bodyParser.urlencoded({ extended: true }));
const Curso = require("../models/Curso.js");


router.get('/', function (req, res) {

    if (typeof req.query.duracion  === 'undefined' &&  typeof req.query.anio_dictado  === 'undefined' ){
        Curso.find(req.query).then(function (cursos) {

            res.json(cursos);

        }).catch((err) => {
            console.error(err);
            res.status(500);
            res.send();
        });


    }else{
        console.log(parseInt(req.query.anio_dictado));
        Curso.aggregate([
            {$project: {tema:1,duracion:1,alumnos:1, anio: {$year: '$anio_dictado'}}},
            {$match: {anio: parseInt(req.query.anio_dictado),  duracion: parseInt(req.query.duracion)  }}
        ]).then(function (cursos) {
            res.json(cursos);
        }).catch((err) => {
            console.error(err);
            res.status(500);
            res.send();
        });
    }
});




router.get('/:tema', function (req, res) {
    Curso.findOne({tema:req.params.tema}).then(function (curso) {
        res.json(curso);
    }).catch((err) => {
        console.error(err);
        res.status(500);
        res.send();
    });
});



router.get('/:tema/alumnos', function (req, res) {
        Curso.find({tema:req.params.tema},{_id:0,alumnos:1}).then(function (alumnos) {
            res.json(alumnos);
        }).catch((err) => {
            console.error(err);
            res.status(500);
            res.send();
        });
});


router.get('/:tema/alumnos/destacado', function (req, res) {
    console.log(req.params.tema);
    Curso.aggregate([
                      { $match: {tema : req.params.tema}},
                      { $unwind: '$alumnos' },
                      { $sort: {'alumnos.nota': -1}}
                    ] ).then(function (alumno) {
                         res.json(alumno[0].alumnos);
    }).catch((err) => {
        console.error(err);
        res.status(500);
        res.send();
    });
});

router.post('/', function (req, res) {

    var curso  = new Curso({
        anio_dictado: new Date(),
        duracion: req.body.duracion,
        tema: req.body.tema,
    });

    curso.save().then(doc => {

        res.status(201).json(doc); //devolvemos created y lo que creamos.

    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
});

router.post('/:tema/inscribirseAlCurso', function (req, res) {
        console.log(req.params.tema);

    Curso.updateOne({tema:req.params.tema },
        {$push:{alumnos:{
                            nombre: req.body.nombre,
                            apellido: req.body.apellido,
                            nota:0,
                            dni: req.body.dni,
                            direccion: req.body.direccion}}}).then(doc => {
                res.status(201).json(doc); //devolvemos created y lo que creamos.
    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
    res.status(201);
});


router.delete('/:tema',function (req,res) {

    Curso.findOneAndDelete({tema: req.params.tema}).then(function (curso) {
        if(curso == null)
        {
            res.status(404).send();
            return;
        }
        res.json(curso);
    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });

});


module.exports = router;
