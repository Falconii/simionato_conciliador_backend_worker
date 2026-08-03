

const {axiosBackEnd, backendURL} = require('../infra/conexao_http');


async function sendEmailTask() {
  console.log("Iniciando tarefa de envio de email...");
  // Simula tarefa demorada
  await new Promise((r) => setTimeout(r, 3000));

  
  const url = new URL("webhook/retorno_email", backendURL).toString();


  // Avisa o backend via webhook
  response = await axiosBackEnd.post(url,
    {
      status: "concluido",
    }
  );


  const retorno = {
    message: "Resposta do backend",
    status: response.status,
    data: response.data,
  };

  console.log(retorno);

  return;
}

module.exports = {
  sendEmailTask,
};
