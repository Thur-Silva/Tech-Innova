"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = sendContactEmail;
// backend/functions/sendEmail.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configuração do transportador Nodemailer
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true para 465, false para 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
async function sendContactEmail(data) {
    const { name, email, message } = data;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'seu_email_de_destino@example.com', // Mude para o seu e-mail de recebimento
        subject: `Nova mensagem de contato de ${name} - Tech Inova`,
        html: `
            <p>Você recebeu uma nova mensagem do formulário de contato do site:</p>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensagem:</strong><br>${message}</p>
            <hr>
            <p>Este e-mail foi enviado automaticamente pelo backend do seu site.</p>
        `,
        replyTo: email
    };
    return transporter.sendMail(mailOptions);
}
