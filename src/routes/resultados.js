let express = require("express");
let router = express.Router();
let resultadoController = require("../controllers/resultadoController");

router.post("/salvar", resultadoController.salvar);
router.get("/historico/:idUsuario", resultadoController.historico);

module.exports = router;
