let ambiente_processo = "desenvolvimento";
let caminho_env = ".env.dev";

if (ambiente_processo == "producao") {
    caminho_env = ".env";
}

require("dotenv").config({ path: caminho_env });

let express = require("express");
let cors = require("cors");
let path = require("path");
let PORTA_APP = process.env.APP_PORT;
let HOST_APP = process.env.APP_HOST;

let app = express();

let usuarioRouter = require("./src/routes/usuarios");
let quizRouter = require("./src/routes/quiz");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/usuarios", usuarioRouter);
app.use("/quiz", quizRouter);

app.listen(PORTA_APP, function () {
    console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP} (ambiente: ${process.env.AMBIENTE_PROCESSO})`);
});
