// ADICIONADO: rotas do quiz, criadas seguindo o PASSO_A_PASSO_CRIAR_ROTA_NA_API.md
let express = require("express");
let router = express.Router();

let quizController = require("../controllers/quizController");

// POST /quiz/salvar -> guarda uma partida (e as respostas dela)
router.post("/salvar", function (req, res) {
    quizController.salvar(req, res);
});

// GET -> dados do dashboard
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

module.exports = router;
