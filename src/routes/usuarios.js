let express = require("express");
let router = express.Router();

let usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/album-favorito", function (req, res) {
    usuarioController.albumFavorito(req, res);
});

module.exports = router;
