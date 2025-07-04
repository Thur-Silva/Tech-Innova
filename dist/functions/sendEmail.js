"use strict";
// backend/functions/sendEmail.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmails = sendContactEmails;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carrega as variáveis de ambiente
// Configuração do transportador Nodemailer
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // Use 'true' se for porta 465 (SSL/TLS), 'false' para 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Aceita certificados auto-assinados (para ambientes de desenvolvimento)
    }
});
// Função para enviar os emails (admin e usuário)
async function sendContactEmails(data) {
    const { name, email, message } = data;
    // --- HTML do Email para Admin (Nova Mensagem) ---
    const mailToAdminHtml = `
    <body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: Arial, sans-serif; font-size: 14px; color: #343A40; -webkit-font-smoothing: antialiased; word-break: break-word;">

  <!-- Outer Table for Background and Centering -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F8F9FA" style="background-color: #F8F9FA; padding: 20px 0; box-sizing: border-box;">
    <tr>
      <td align="center" valign="top">
        <!-- Main Content Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #E0E0E0;">
          <tr>
            <td style="padding: 25px 30px;">

              <!-- Header Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="padding-bottom: 20px;">
                    <!-- Tech Innova Logo/Title (Clean Text) -->
                    <p style="font-family: 'Inter', Arial, sans-serif; font-size: 24px; font-weight: bold; color: #343A40; margin: 0;">Tech Innova</p>
                    <p style="font-size: 15px; color: #6C757D; margin: 5px 0 0;">Nova Mensagem de Contato</p>
                  </td>
                </tr>
              </table>

              <!-- Thin Separator Line -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 0 20px;">
                    <div style="height: 1px; background-color: #E0E0E0; width: 100%;"></div>
                  </td>
                </tr>
              </table>

              <!-- Message Details Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="color: #343A40; font-size: 15px; line-height: 1.6;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <strong style="color: #6C757D;">Nome:</strong> ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <strong style="color: #6C757D;">Email:</strong> <a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <strong style="color: #6C757D;">Mensagem:</strong><br/>
                    <div style="background-color: #F8F9FA; padding: 15px; border-radius: 6px; line-height: 1.7; color: #495057; margin-top: 8px; border: 1px solid #E9ECEF; white-space: pre-wrap; overflow-wrap: break-word; font-size: 14px;">${message}</div>
                  </td>
                </tr>
              </table>

              <!-- Footer Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top: 20px; text-align: center; font-size: 12px; color: #6C757D; border-top: 1px solid #E0E0E0;">
                    <p style="margin: 0;">Este email foi gerado automaticamente pelo sistema de contato da Tech Innova.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
  `;
    // --- HTML do Email para Usuário (Confirmação de Recebimento) ---
    const mailToUserHtml = `
 <body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: Arial, sans-serif; font-size: 14px; color: #343A40; -webkit-font-smoothing: antialiased; word-break: break-word;">

  <!-- Outer Table for Background and Centering -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F8F9FA" style="background-color: #F8F9FA; padding: 20px 0; box-sizing: border-box;">
    <tr>
      <td align="center" valign="top">
        <!-- Main Content Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #E0E0E0;">
          <tr>
            <td style="padding: 25px 30px;">

              <!-- Header Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="padding-bottom: 20px;">
                    <!-- Tech Innova Logo/Title (Clean Text) -->
                    <p style="font-family: 'Inter', Arial, sans-serif; font-size: 24px; font-weight: bold; color: #343A40; margin: 0;">Tech Innova</p>
                    <p style="font-size: 15px; color: #6C757D; margin: 5px 0 0;">Sua mensagem foi recebida!</p>
                  </td>
                </tr>
              </table>

              <!-- Thin Separator Line -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 0 20px;">
                    <div style="height: 1px; background-color: #E0E0E0; width: 100%;"></div>
                  </td>
                </tr>
              </table>

              <!-- Message Content Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="color: #343A40; font-size: 15px; line-height: 1.6;">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <p style="margin: 0; font-size: 16px;">Olá, <strong style="color: #343A40;">${name}</strong>,</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0;">
                      Agradecemos por entrar em contato com a Tech Innova. Sua mensagem foi recebida e será analisada com a devida atenção.
                    </p>
                    <p style="margin: 15px 0 0;">
                      Nossa equipe retornará o contato em breve com as informações que você precisa.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-top: 15px; padding-bottom: 30px;">
                    <a href="https://seusite.com.br" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #28C273; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; border: 1px solid #2F855A; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      Visitar nosso site
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top: 20px; text-align: center; font-size: 12px; color: #6C757D; border-top: 1px solid #E0E0E0;">
                    <p style="margin: 0;">Atenciosamente,</p>
                    <p style="margin: 5px 0 0; font-size: 14px; font-weight: bold;">Equipe Tech Innova</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
  `;
    // Objeto do email para o Admin
    const mailToAdmin = {
        from: `"${name}" <${email}>`,
        to: `"${process.env.EMAIL_TO_NAME}" <${process.env.EMAIL_TO}>`,
        subject: `Nova mensagem de ${name} no Tech Innova`,
        html: mailToAdminHtml,
        replyTo: email,
    };
    // Objeto do email para o Usuário
    const mailToUser = {
        from: `"Tech Innova" <${process.env.EMAIL_USER}>`,
        to: `"${name}" <${email}>`,
        subject: 'Recebemos sua mensagem!',
        html: mailToUserHtml,
    };
    await transporter.sendMail(mailToAdmin);
    await transporter.sendMail(mailToUser);
}
