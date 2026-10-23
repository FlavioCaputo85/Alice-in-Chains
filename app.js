let express = require("express");
let path = require("path");
require("dotenv").config({ path: ".env.dev" });

let app = express();
let PORTA = process.env.APP_PORT || 3333;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// LOGIN/BANCO DESATIVADOS POR ENQUANTO (reativar depois):
// app.use("/usuarios", require("./src/routes/usuarios"));
// app.use("/resultados", require("./src/routes/resultados"));

app.listen(PORTA, function () {
    console.log("Quiz DIRT rodando em http://localhost:" + PORTA);
});
