let express = require("express");
let router = express.Router();

let quizController = require("../controllers/quizController");

router.get("/perguntas/:idNivel", function (req, res) {
    quizController.perguntas(req, res);
});

router.post("/salvar", function (req, res) {
    quizController.salvar(req, res);
});

router.get("/kpis/:idUsuario", function (req, res) {
    quizController.kpis(req, res);
});

router.get("/evolucao/:idUsuario", function (req, res) {
    quizController.evolucao(req, res);
});

router.get("/albuns/:idUsuario", function (req, res) {
    quizController.albuns(req, res);
});

router.get("/ranking", function (req, res) {
    quizController.ranking(req, res);
});

router.get("/dificeis", function (req, res) {
    quizController.dificeis(req, res);
});

module.exports = router;
