const nodemailer = require("nodemailer");
const credencialEmailSrv = require("../../shared/service/credencialEmailService");

/* cache de transporters: chave empresa-id, reaproveitado enquanto a credencial não mudar */
const cache = new Map();

async function getTransporter(id_empresa, id) {
    const cred = await credencialEmailSrv.getCredencialEmail(id_empresa, id);

    if (!cred) {
        throw new Error(`Credencial de e-mail não encontrada (empresa ${id_empresa}, id ${id})`);
    }


    const chave = `${id_empresa}-${id}`;
    const assinatura = `${cred.smtp}|${cred.email}|${cred.pass}`;
    const emCache = cache.get(chave);

    if (emCache && emCache.assinatura === assinatura) {
        return { transporter: emCache.transporter, cred };
    }

    const transporter = nodemailer.createTransport({
        host: cred.smtp,
        port: 465,
        secure: true, // SSL na porta 465
        auth: {
            user: cred.email,
            pass: cred.pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
        greetingTimeout: 15000,
    });

    cache.set(chave, { assinatura, transporter });

    return { transporter, cred };
}

/*
    Envia e-mail usando a credencial (credenciais_emails) informada.
    { id_empresa, id, to, subject, html, text, attachments, cc, bcc }
*/
async function enviarEmail({ id_empresa, id, ...mensagem }) {
    const { transporter, cred } = await getTransporter(id_empresa, id);

    const resultado = await transporter.sendMail({
        from: `"${cred.descricao}" <${cred.email}>`,
        ...mensagem,
    });

    if (resultado.rejected && resultado.rejected.length) {
        throw new Error(`Destinatário rejeitado pelo servidor: ${resultado.rejected.join(", ")}`);
    }

    return resultado;
}

module.exports = { getTransporter, enviarEmail };
