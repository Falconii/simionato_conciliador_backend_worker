/* ROUTE credenciais */
const express = require("express");
const router = express.Router();

/* Login */
router.post("/retorno_email", async function (req, res) {
  try {
    const status = req.body.status;

    console.log("Webhook Retorno E-mail Recebido com Status:", status);

    res.status(200).json({
      message: "E-Mail Processado com Status!",
      status,
    });
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

module.exports = router;
