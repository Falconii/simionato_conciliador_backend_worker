const express = require("express");
const cors = require("cors");
const app = express();
const processamentoSrv = require('../shared/service/processamentoService');


const iniciar = async function () {
   
 processamentoSrv.startProcessamentoTarefas(10); // Inicia o processamento a cada 5 segundos

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

app.listen(PORT, () => {
  console.log(`Worker Consolidador No Ar. Porta ${PORT}`);
});


iniciar();