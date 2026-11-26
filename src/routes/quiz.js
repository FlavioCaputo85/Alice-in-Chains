let express = require("express");
let router = express.Router();

let quizController = require("../controllers/quizController");

router.get("/perguntas/:nivel", function (req, res) {
    quizController.perguntas(req, res);
});

router.post("/salvar", function (req, res) {
    quizController.salvar(req, res);
});

router.get("/kpi-pontos/:idUsuario", function (req, res) {
    quizController.kpiPontos(req, res);
});

router.get("/kpi-ranking", function (req, res) {
    quizController.kpiRanking(req, res);
});

router.get("/kpi-acertos/:idUsuario", function (req, res) {
    quizController.kpiAcertos(req, res);
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
