"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 🛡️ Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// 📧 Configuração do Nodemailer
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
// 📨 Rota de envio de email
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Mensagem de ${name} via TechInnova`,
        html: `
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensagem:</strong> ${message}</p>
    `,
        replyTo: email,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado!');
        return res.status(200).json({ message: 'Email enviado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao enviar:', error);
        return res.status(500).json({ message: 'Erro ao enviar email.' });
    }
});
// 🔗 Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor backend de email está rodando!');
});
// 🚀 Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
