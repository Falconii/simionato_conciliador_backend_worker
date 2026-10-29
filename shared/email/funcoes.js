const usuarioSrv = require("../../shared/service/usuarioService");
const tokenSrv = require("../../shared/service/tokenService");
const correcaoEmailSrv = require("../../shared/service/correcaoEmailService");
const simHistoricoSrv = require("../../shared/service/sim_historicoService");

const fs = require("fs");
const path = require("path");
const { enviarEmail } = require("../../shared/email/email_simionato");

/* credencial padrão dos envios do sistema (credenciais_emails: id_empresa = 1, id = 1) */
const ID_EMPRESA_EMAIL = 1;
const ID_CREDENCIAL_EMAIL = 1;

function enviar(mensagem) {
  return enviarEmail({ id_empresa: ID_EMPRESA_EMAIL, id: ID_CREDENCIAL_EMAIL, ...mensagem });
}

function htmlEventoLiberacao(evento) {
  return `
<div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
  <div style="max-width:700px; margin:auto; background:white; border-radius:8px; 
              border:1px solid #d9d9d9; padding:20px;">

    <h2 style="margin:0 0 20px 0; color:#1a73e8; text-align:center; 
               font-weight:600; border-bottom:2px solid #1a73e8; padding-bottom:10px;">
      Detalhes da Atividade
    </h2>

    <table width="100%" cellpadding="8" cellspacing="0" 
           style="font-size:14px; border-collapse:collapse;">

      <tr style="background:#eef3fb;">
        <td width="50%" style="border:1px solid #ddd;">
          <strong>Código:</strong><br>${evento.id}
        </td>
        <td width="50%" style="border:1px solid #ddd;">
          <strong>Situação:</strong><br>Aguardando Liberação
        </td>
      </tr>

      <tr>
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Responsável:</strong><br>${evento.usuario_razao}
        </td>
      </tr>

      <tr style="background:#eef3fb;">
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Descrição:</strong><br>${evento.descricao}
        </td>
      </tr>

      <tr>
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Rua:</strong><br>${evento.rua || ""}
        </td>
      </tr>

      <tr style="background:#eef3fb;">
        <td style="border:1px solid #ddd;">
          <strong>Número:</strong><br>${evento.nro || ""}
        </td>
        <td style="border:1px solid #ddd;">
          <strong>Bairro:</strong><br>${evento.bairro || ""}
        </td>
      </tr>

      <tr>
        <td style="border:1px solid #ddd;">
          <strong>Cidade:</strong><br>${evento.cidade || ""}
        </td>
        <td style="border:1px solid #ddd;">
          <strong>Estado:</strong><br>${evento.uf || ""}
        </td>
      </tr>

      <tr style="background:#eef3fb;">
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Complemento:</strong><br>${evento.complemento || ""}
        </td>
      </tr>

      <tr>
        <td style="border:1px solid #ddd;">
          <strong>CEP:</strong><br>${evento.cep || ""}
        </td>
        <td style="border:1px solid #ddd;">&nbsp;</td>
      </tr>

      <tr style="background:#eef3fb;">
        <td style="border:1px solid #ddd;">
          <strong>Data Inicial:</strong><br>${evento.inicio}
        </td>
        <td style="border:1px solid #ddd;">
          <strong>Data Final:</strong><br>${evento.final}
        </td>
      </tr>

      <tr>
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Observação:</strong><br>${evento.obs || ""}
        </td>
      </tr>

    </table>

  </div>
</div>
  `;
}

function htmlEventoLiberacaoEx01(evento, url) {
  return ` <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Liberação de Evento</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 640px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      padding: 20px 24px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 180px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 16px;
      color: #333333;
    }
    .info-block {
      margin-bottom: 16px;
    }
    .label {
      font-weight: bold;
      color: #555555;
      display: inline-block;
      min-width: 140px;
    }
    .value {
      color: #222222;
    }
    .obs {
      margin-top: 12px;
      padding: 10px 12px;
      background-color: #f9f9f9;
      border-left: 3px solid #1976d2;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .button-area {
      text-align: center;
      margin-top: 30px;
    }
    .btn {
      padding: 14px 26px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      color: #ffffff !important;
      margin: 0 10px;
    }
    .btn-aprovar {
      background-color: #28a745;
    }
    .btn-negar {
      background-color: #dc3545;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="logo">
      
    </div>

    <h1>Liberação de Evento</h1>

    <p>Segue abaixo o resumo do evento para liberação:</p>

    ${htmlEventoLiberacao(evento)}
    
    <div class="button-area">
      <a class="btn btn-aprovar" href="${url}">
        APROVAR EVENTO
      </a>
   
    </div>

    <div class="footer">
      Este e-mail foi gerado automaticamente pelo sistema de eventos.<br>
      Por favor, não responda diretamente a esta mensagem.
    </div>

  </div>
</body>
</html>`;
}

exports.htmlEventoLiberacaoEx02 = function (
  codigo,
  descricao,
  cidade,
  estado,
  responsavel,
  dataInicial,
  dataFinal,
  observacoes,
  destinatario,
) {
  return ` <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Liberação de Evento</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 640px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      padding: 20px 24px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 180px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 16px;
      color: #333333;
    }
    .info-block {
      margin-bottom: 16px;
    }
    .label {
      font-weight: bold;
      color: #555555;
      display: inline-block;
      min-width: 140px;
    }
    .value {
      color: #222222;
    }
    .obs {
      margin-top: 12px;
      padding: 10px 12px;
      background-color: #f9f9f9;
      border-left: 3px solid #1976d2;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .button-area {
      text-align: center;
      margin-top: 30px;
    }
    .btn {
      padding: 14px 26px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      color: #ffffff !important;
      margin: 0 10px;
    }
    .btn-aprovar {
      background-color: #28a745;
    }
    .btn-negar {
      background-color: #dc3545;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="logo">
      <img src="data:image/jpeg;base64,${logoBase64}" alt="Logo TKX">
    </div>

    <h1>Liberação de Evento</h1>

    <p>Segue abaixo o resumo do evento para liberação:</p>

    <div class="info-block">
      <div><span class="label">Código do evento:</span> <span class="value">${codigo}</span></div>
      <div><span class="label">Descrição:</span> <span class="value">${descricao}</span></div>
      <div><span class="label">Cidade / Estado:</span> <span class="value">${cidade} / ${estado}</span></div>
      <div><span class="label">Responsável:</span> <span class="value">${responsavel}</span></div>
      <div><span class="label">Data inicial:</span> <span class="value">${dataInicial}</span></div>
      <div><span class="label">Data final:</span> <span class="value">${dataFinal}</span></div>
    </div>

    <div class="obs">
      <strong>Observações:</strong><br>
      ${observacoes || "Sem observações."}
    </div>

    <div class="button-area">
      <a class="btn btn-aprovar" href="https://seusistema.com/aprovar-evento/${codigo}">
        APROVAR EVENTO
      </a>

      <a class="btn btn-negar" href="https://seusistema.com/negar-evento/${codigo}">
        NEGAR EVENTO
      </a>
    </div>

    <div class="footer">
      Este e-mail foi gerado automaticamente pelo sistema de eventos.<br>
      Por favor, não responda diretamente a esta mensagem.
    </div>

  </div>
</body>
</html>`;
};

exports.htmlEventoLiberacaoEx03 = function (
  codigo,
  descricao,
  cidade,
  estado,
  responsavel,
  dataInicial,
  dataFinal,
  observacoes,
  destinatario,
) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Status do Evento</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 640px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      padding: 20px 24px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 180px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 16px;
      color: #333333;
    }
    .info-block {
      margin-bottom: 16px;
    }
    .label {
      font-weight: bold;
      color: #555555;
      display: inline-block;
      min-width: 140px;
    }
    .value {
      color: #222222;
    }
    .obs {
      margin-top: 12px;
      padding: 10px 12px;
      background-color: #f9f9f9;
      border-left: 3px solid #1976d2;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .status-area {
      text-align: center;
      margin-top: 30px;
      font-size: 20px;
      font-weight: bold;
      padding: 14px;
      border-radius: 6px;
      color: #ffffff;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
    }
    .status-liberado {
      background-color: #28a745;
    }
    .status-recusado {
      background-color: #dc3545;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="logo">
      <img src="data:image/jpeg;base64,${logoBase64}" alt="Logo TKX">
    </div>

    <h1>Status do Evento</h1>

    <p>Segue abaixo o resumo do evento:</p>

    <div class="info-block">
      <div><span class="label">Código do evento:</span> <span class="value">${codigo}</span></div>
      <div><span class="label">Descrição:</span> <span class="value">${descricao}</span></div>
      <div><span class="label">Cidade / Estado:</span> <span class="value">${cidade} / ${estado}</span></div>
      <div><span class="label">Responsável:</span> <span class="value">${responsavel}</span></div>
      <div><span class="label">Data inicial:</span> <span class="value">${dataInicial}</span></div>
      <div><span class="label">Data final:</span> <span class="value">${dataFinal}</span></div>
    </div>

    <div class="obs">
      <strong>Observações:</strong><br>
      ${observacoes || "Sem observações."}
    </div>

    <!-- STATUS DO EVENTO -->
    <div class="status-area ${statusMensagem === "Evento Liberado" ? "status-liberado" : "status-recusado"}">
      ${statusMensagem}
    </div>

    <div class="footer">
      Este e-mail foi gerado automaticamente pelo sistema de eventos.<br>
      Por favor, não responda diretamente a esta mensagem.
    </div>

  </div>
</body>
</html>`;
};

async function enviarEmailLiberacaoEvento(evento, destinatario) {
  // Caminho do logo no seu projeto
  //const caminhoLogo = path.join(__dirname, "../tkx_backend/logo/logo-tkx.jpg");

  // Converte o logo para base64
  //const logoBase64 = fs.readFileSync(caminhoLogo, { encoding: "base64" });

  // Monta o HTML com o logo embutido

    let url = "";

  if (process.env.APP_URL) {
    url = process.env.APP_URL.concat(`redefine_senha?token=${token}`);
    console.log("URL", url);
  } else {
    url = fs.readFileSync("./app_url.txt", "utf8");
    url = url.concat(`liberarevento?token=${token}`);
    console.log("URL - Arquivo", url);
  }


  const htmlAprovacao = htmlEventoLiberacaoEx01(evento, url);

  try {
    const resposta = await enviar({
      to: destinatario,
      subject: `Liberação do Evento - ${evento.descricao}`,
      html: htmlAprovacao,
    });

    console.log("Email enviado:", resposta);
    return resposta;
  } catch (erro) {
    console.error("Erro ao enviar email:", erro);
    throw erro;
  }
}

exports.preparaEmailLiberacao = async function (id_empresa, id_evento) {
  const evento = await eventoSrv.getEvento(id_empresa, id_evento);

  const par = {
    id_empresa: id_empresa,
    id: 16,
    razao: "",
    cnpj_cpf: "",
    grupo: 0,
    pagina: 0,
    tamPagina: 50,
    contador: "N",
    orderby: "",
    sharp: false,
  };

  const usuario = await usuarioSrv.getUsuarios(par);

  const destinatario = usuario[0].email;

  await enviarEmailLiberacaoEvento(evento, destinatario);
};

exports.enviarEmailNovaSenha = async function (usuario, token) {
  const destinatario = usuario.email;

  let url = "";

  if (process.env.APP_URL) {
    url = process.env.APP_URL.concat(`redefine_senha?token=${token}`);
    console.log("URL", url);
  } else {
    url = fs.readFileSync("./app_url.txt", "utf8");
    url = url.concat(`redefine_senha?token=${token}`);
    console.log("URL - Arquivo", url);
    console.log("Conexão configurada Para Local!! -conexoes_local.json");
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>  
  <meta charset="UTF-8" />
  <title>Link Para Troca De Senha</title>
  <style>     
    body {        
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f4;
      margin: 0;        
      padding: 0;    
    }    
    .container {      

      max-width: 640px;      
      margin: 20px auto;      
      background-color: #ffffff;    
      border-radius: 6px;      
      border: 1px solid #e0e0e0;      
      padding: 20px 24px;

    }
      </style>
</head>
<body>  
  <div class="container">    
    <h1>Solicitação de Troca De Senha</h1>    
    <p>${usuario.razao},</p>  
    <p>Para redefinir sua senha, clique no link abaixo:</p>
    <p><a href="${url}" target="_blank">Redefinir minha senha</a></p>
    <p>Recomendamos que você altere essa senha após o primeiro acesso para garantir a segurança da sua conta.</p> 
    <p>Se você não solicitou essa alteração, por favor, entre em contato com o suporte imediatamente.</p>    
    <p>Atenciosamente,<br>Equipe de Suporte</p>  
  </div>
</body>
</html>`;

  try {
    const resposta = await enviar({
      to: destinatario,
      subject: `Link Para Troca De Senha`,
      html: html,
    });

    console.log("Email enviado:", resposta);
    return resposta;
  } catch (erro) {
    console.error("Erro ao enviar email:", erro);
    throw erro;
  }
};

exports.preparaEmailNovaSenha = async function (id_empresa, id_usuario) {
  const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

  const token = tokenSrv.generateTempoToken(usuario);

  console.log(usuario, token);

  await exports.enviarEmailNovaSenha(usuario, token);
};

exports.enviarEmailRelatorioEvento = async function (usuario, owner, arquivo) {

  const destinatario = usuario.email;

  console.log("enviarEmailRelatorioEvento", destinatario, owner, arquivo);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório de Evento</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:32px 0;">
    <tr>
      <td align="center">

        <table width="640" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff; border:1px solid #e0e0e0; padding:32px;">

          <!-- Título -->
          <tr>
            <td style="font-size:28px; font-weight:bold; color:#222222; letter-spacing:-0.5px; padding-bottom:20px;">
              Relatório do Evento
            </td>
          </tr>

          <!-- Subtítulo / Identificação -->
          <tr>
            <td style="font-size:18px; color:#555555; font-weight:500; padding-bottom:20px;">
              ${owner}
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="font-size:16px; line-height:1.6; color:#333333; padding-bottom:20px;">
              Segue em anexo o relatório solicitado.
            </td>
          </tr>

          <!-- Assinatura -->
          <tr>
            <td style="font-size:16px; line-height:1.6; color:#333333;">
              Atenciosamente,<br>
              <span style="font-weight:600;">Equipe de Suporte</span>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  try {

    const resposta = await enviar({
      to: destinatario,
      subject: `Relatório - ${owner}`,
      html: html,
      attachments: [
        {
          filename: path.basename(arquivo),
          path: arquivo,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      ]
    });

    console.log("Email enviado:", resposta);

    return {message: "E-Mail Enviado Com Sucesso!"};
    
  } catch (erro) {
    console.error(erro);
    return {message: "Falha Ao Enviar E-Mail!"};
  }
};


exports.preparaEmailRelatorioEvento = async function (usuario,owner, arquivo) {

  return  await exports.enviarEmailRelatorioEvento(usuario,owner,arquivo);

};

/* ======== ACEITE DE CORREÇÃO ======== */

/* o texto vem do usuário (descrição, mensagens), então é escapado antes de ir para o HTML */
function escapaHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* mesmos textos de situacoesCorrecao e statusAssinaturaCorrecao do front */
const SITUACAO_CORRECAO = {
  "0": "Não Enviado",
  "1": "Aguardando Executor",
  "2": "Em Andamento",
  "3": "Correção Aceita - Aguardando Ação",
  "9": "Encerrada",
};

function textoAssinatura(sigla) {
  if (!sigla || !String(sigla).trim()) return "-";
  return sigla === "S" ? "OK" : "Falta Assinatura";
}

/* link para abrir o sistema: APP_URL ou app_url.txt, como nas outras funções */
function urlSistema() {
  try {
    if (process.env.APP_URL) return process.env.APP_URL;
    return fs.readFileSync("./app_url.txt", "utf8").trim();
  } catch (erro) {
    return "";
  }
}

/* valor em reais: 1234.5 -> R$ 1.234,50 */
function formataValor(valor) {
  const n = Number(valor);
  if (valor === null || valor === undefined || valor === "" || Number.isNaN(n)) return "-";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* sim = linha de sim_historicos (só quando a origem da correção é SIM) */
function htmlAceiteCorrecao(usuario, cabCorrecao, detalhes, token, sim) {
  const base = urlSistema();
  /* com token, o link leva direto ao aceite (válido por 5 horas) */
  const url = base && token
    ? base.concat(`correcoes/aceite?token=${token}&id_cab_correcao=${cabCorrecao.id}`)
    : base;

  const mensagens = detalhes
    .map(
      (d) => `
      <tr>
        <td style="border:1px solid #ddd; padding:8px; font-size:14px;">
          <strong>${escapaHtml(d.data)}</strong> - ${escapaHtml(d.exec_nome)}<br>
          <span style="white-space:pre-wrap;">${escapaHtml(d.mensagem)}</span>
        </td>
      </tr>`,
    )
    .join("");

  const blocoMensagens = detalhes.length
    ? `<h3 style="margin:20px 0 8px 0; color:#333;">Mensagens</h3>
       <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${mensagens}</table>`
    : "";

  const blocoSim = sim
    ? `<tr>
        <td style="border:1px solid #ddd;"><strong>Razão Social:</strong><br>${escapaHtml(sim.nomcli)}</td>
        <td style="border:1px solid #ddd;"><strong>Valor do Contrato:</strong><br>${escapaHtml(formataValor(sim.valorsazonal))}</td>
      </tr>
      <tr style="background:#eef3fb;">
        <td style="border:1px solid #ddd;"><strong>Qtd. de Acordos:</strong><br>${escapaHtml(sim.qtd_acordos_pdf ?? "-")}</td>
        <td style="border:1px solid #ddd;"><strong>Total dos Acordos:</strong><br>${escapaHtml(formataValor(sim.vlr_acordos_pdf))}</td>
      </tr>`
    : "";

  const botao = url
    ? `<p style="text-align:right; margin-top:30px;">
         <a href="${escapaHtml(url)}" style="text-decoration:none; font-size:16px;
            font-weight:bold; color:#28a745;">
           ACEITAR CORREÇÃO
         </a>
       </p>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Aceite de Correção</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
  <div style="max-width:640px; margin:20px auto; background-color:#f4f4f4; border-radius:6px;
              border:1px solid #e0e0e0; padding:20px 24px;">

    <h1 style="font-size:20px; margin:0 0 16px 0; color:#333333; text-align:center;">Aceite de Correção</h1>

    <p style="text-align:center; font-size:16px; color:#333333;"><strong>Correção Solicitada Por:</strong> ${escapaHtml(cabCorrecao.sol_nome)}</p>
    <p style="color:#333333;">Foi incluída uma correção que aguarda aceite. Segue o resumo:</p>

    <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px; border-collapse:collapse;">
      <tr style="background:#eef3fb;">
        <td width="50%" style="border:1px solid #ddd;"><strong>Código:</strong><br>${escapaHtml(cabCorrecao.id)}</td>
        <td width="50%" style="border:1px solid #ddd;"><strong>Situação:</strong><br>${escapaHtml(SITUACAO_CORRECAO[cabCorrecao.status] ?? "")}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd;"><strong>Origem:</strong><br>${escapaHtml(cabCorrecao.origem)} - ${escapaHtml(cabCorrecao.id_origem)}</td>
        <td style="border:1px solid #ddd;"><strong>Data:</strong><br>${escapaHtml(cabCorrecao.cadastr)}</td>
      </tr>
      ${blocoSim}
      <tr style="background:#eef3fb;">
        <td colspan="2" style="border:1px solid #ddd;"><strong>Tarefa:</strong><br>${escapaHtml(cabCorrecao.tarefa)}</td>
      </tr>
      <tr style="background:#eef3fb;">
        <td style="border:1px solid #ddd;"><strong>Solicitante:</strong><br>${escapaHtml(cabCorrecao.sol_nome)}</td>
        <td style="border:1px solid #ddd;"><strong>Executor:</strong><br>${escapaHtml(cabCorrecao.exec_nome) || "-"}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd;"><strong>Assinatura GP:</strong><br>${textoAssinatura(cabCorrecao.status_assinatura_gp)}</td>
        <td style="border:1px solid #ddd;"><strong>Assinatura Cliente:</strong><br>${textoAssinatura(cabCorrecao.status_assinatura_cliente)}</td>
      </tr>
    </table>

    ${blocoMensagens}
    ${botao}

    <p style="margin-top:24px; font-size:12px; color:#888888; text-align:center;">
      Este e-mail foi gerado automaticamente pelo sistema.<br>
      Por favor, não responda diretamente a esta mensagem.
    </p>
  </div>
</body>
</html>`;
}

/* destinatário inicial: e-mail do solicitante da correção */
exports.enviarEmailAceiteCorrecao = async function (usuario, cabCorrecao, detalhe, token, destinatarioEmail, sim) {
  const destinatario = destinatarioEmail || cabCorrecao.sol_email || usuario.email;


  if (!destinatario) {
    return { message: "Falha: Solicitante Sem E-Mail Cadastrado!" };
  }

  /* detalhe pode vir como um objeto ou como uma lista de mensagens */
  const detalhes = Array.isArray(detalhe) ? detalhe : detalhe ? [detalhe] : [];

  try {
    /* montado dentro do try: um erro aqui não pode virar rejeição sem tratamento */
    const html = htmlAceiteCorrecao(usuario, cabCorrecao, detalhes, token, sim);

    const resposta = await enviar({
      to: destinatario,
      subject: `Aceite de Correção - ${cabCorrecao.id}`,
      html: html,
    });

    console.log("Email enviado:", resposta);

    return { message: "E-Mail Enviado Com Sucesso!" };
  } catch (erro) {
    console.error("Erro ao enviar email:", erro);
    return { message: "Falha Ao Enviar E-Mail!" };
  }
};

/* grupos: solicitante do 902 ou 906 avisa o grupo 1 e solicitante do 1 avisa o 902 */
const GRUPO_DESTINO_ACEITE = { 902: 1, 906: 1, 1: 902 };

/* destinatários cadastrados em correcoes_emails que pertencem ao grupo de destino */
async function destinatariosAceite(usuario) {
  const grupoDestino = GRUPO_DESTINO_ACEITE[Number(usuario.grupo)];

  if (!grupoDestino) {
    return [];
  }

  const auditores = await correcaoEmailSrv.getCorrecoesEmails({
    id_empresa: usuario.id_empresa,
    id: 0,
    id_auditor: 0,
    auditor_grupo: grupoDestino,
    pagina: 0,
    tamPagina: 50,
    contador: "N",
    orderby: "",
    sharp: false,
  });

  /* sem e-mail ou repetido não entra na lista; guarda o usuário dono do e-mail para o token */
  const destinatarios = new Map();
  for (const a of auditores) {
    const email = (a.auditor_email || "").trim();
    if (email !== "" && !destinatarios.has(email)) {
      destinatarios.set(email, { id_usuario: a.id_auditor, email });
    }
  }

  return [...destinatarios.values()];
}

exports.PreparaEmailAceiteCorrecao = async function (usuario, cabCorrecao, detalhe) {
  const destinatarios = await destinatariosAceite(usuario);

  if (destinatarios.length === 0) {
    return { message: "Falha: Nenhum Destinatário Cadastrado Para O Aceite!" };
  }

  /* dados do contrato (razão social e valor) quando a correção vem de um SIM */
  let sim = null;
  if (String(cabCorrecao.origem).toUpperCase() === "SIM" && cabCorrecao.id_origem) {
    sim = await simHistoricoSrv.getSim_Historico(cabCorrecao.id_empresa ?? usuario.id_empresa, cabCorrecao.id_origem);
  }

  let enviados = 0;
  let falhas = 0;

  for (const destinatario of destinatarios) {
    /* token de aceite (5h) de cada e-mail: só vale para este destinatário e esta correção */
    const token = tokenSrv.token_aceite(
      cabCorrecao.id_empresa ?? usuario.id_empresa,
      destinatario.id_usuario,
      cabCorrecao.id,
    );
    const envio = await exports.enviarEmailAceiteCorrecao(usuario, cabCorrecao, detalhe, token, destinatario.email, sim);
    if (envio.message.startsWith("Falha")) {
      falhas++;
    } else {
      enviados++;
    }
  }

  if (falhas > 0) {
    return { message: `Falha: ${falhas} De ${destinatarios.length} E-Mails Não Enviados!` };
  }

  return { message: `E-Mail Enviado Com Sucesso! (${enviados})` };
};
