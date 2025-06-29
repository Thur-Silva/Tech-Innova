"use strict";
// server.ts (ou o nome do seu arquivo principal do backend)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // <--- GARANTA ESTA IMPORTAÇÃO
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Ou a URL do seu frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// Configuração do transportador Nodemailer (restante do código...)
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
// Rota para enviar e-mail
// Linha 19 (aproximadamente, dependendo do seu código exato)
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos os campos (Nome, Email, Mensagem) são obrigatórios.' });
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'email_de_destino@example.com', // Mude para o e-mail que receberá as mensagens
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
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ message: 'Erro ao enviar o e-mail. Tente novamente mais tarde.' });
    }
});
app.get('/', (req, res) => {
    res.send('Backend do enviador de e-mails está rodando!');
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
