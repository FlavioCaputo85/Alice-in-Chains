let express = require("express");
let router = express.Router();
let usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", usuarioController.cadastrar);
router.post("/autenticar", usuarioController.autenticar);

module.exports = router;
