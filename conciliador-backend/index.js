const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const fs = require("fs");
const path = require("path");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Garante que a pasta "upload" existe
const uploadDir = path.join(__dirname, "upload");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Pasta 'upload' criada.");
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* const allowCors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // colocar os dominios permitidos | ex: 127.0.0.1:3000

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token, X-Key",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, PATCH",
  );

  res.header("Access-Control-Allow-Credentials", "false");

  next();
};

app.use(allowCors);
 */
app.use(express.json());

app.use("/api/testeworker", require("./route/testeworkerRoute"));

app.use("/api/webhook", require("./route/webhookRoute"));

app.use("/api/login", require("./route/loginRoute"));
app.use("/api/empresa", require("./route/empresaRoute"));
app.use("/api/parametro", require("./route/parametroRoute.js"));
app.use(
  "/api/parametro/complementar",
  require("./route/complementar/parametroRoute.js"),
);
app.use("/api/token", require("./route/tokenRoute"));
app.use("/api/usuario", require("./route/usuarioRoute"));
app.use("/api/grupousuario", require("./route/grupousuarioRoute"));
app.use("/api/importacaosim", require("./route/ImportacaoSimRoute.js"));
app.use("/api/importacaopaf", require("./route/ImportacaoPafRoute.js"));
app.use("/api/contrato_cab", require("./route/contrato_cabRoute.js"));
app.use("/api/contrato_det", require("./route/contrato_detRoute.js"));
app.use("/api/assinatura", require("./route/assinaturaRoute.js"));

app.use(
  "/api/contrato_det/complementar",
  require("./route/complementar/contrato_detRoute.js"),
);
app.use(
  "/api/sim_historico",
  require("./route/sim_historicoRoute.js"),
);
app.use(
  "/api/sim_historico/complementar",
  require("./route/complementar/sim_historicoRoute.js"),
);
app.use(
  "/api/assinatura/complementar",
  require("./route/complementar/assinaturaRoute.js"),
);

app.use("/api/google_drive", require("./route/google_driveRoute.js"));
app.use("/api/doc_gdrive", require("./route/doc_gdriveRoute.js"));
app.use("/api/paf_det", require("./route/paf_detRoute.js"));
app.use("/api/paf_cab", require("./route/paf_cabRoute.js"));
app.use("/api/pst_anexo", require("./route/pst_anexoRoute.js"));
app.use("/api/pst_email", require("./route/pst_emailRoute.js"));
app.use("/api/relatorio/complementar", require("./route/complementar/relatorioRoute.js"));
app.use("/api/sim_acordo", require("./route/sim_acordoRoute.js"));


app.listen(PORT, () => {
  console.log(`Servidor No Ar. Porta ${PORT}`);
});
