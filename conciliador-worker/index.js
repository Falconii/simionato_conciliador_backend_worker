const express = require("express");
const cors = require("cors");
const app = express();
const processamentoSrv = require('../shared/service/processamentoService');

const { APP_ROOT } = require("./root.js");

global.APP_ROOT = APP_ROOT;

console.log("ROOT:", APP_ROOT);



const iniciar = async function () {
   
 processamentoSrv.startProcessamentoTarefas(30); // Inicia o processamento a cada 5 segundos

};

const PORT = 3012;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/worker", require("./route/taskRoute"));
app.use("/api/relatorio", require("./route/relatorioRoute"));


app.listen(PORT, () => {
  console.log(`Worker Consolidador No Ar. Porta ${PORT}`);
});




console.log("ROOT",APP_ROOT);

iniciar();