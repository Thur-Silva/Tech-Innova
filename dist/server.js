"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sendEmail_1 = require("./functions/sendEmail");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', '*'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// Configuração de arquivos estáticos
const publicPath = path_1.default.resolve(__dirname, '..');
app.use(express_1.default.static(publicPath));
// Servir componentes
app.use('/components', express_1.default.static(path_1.default.resolve(__dirname, '../components')));
// Rotas para páginas principais
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../pages/index/index.html'));
});
app.get('/ContactUs/ContactUs', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../pages/ContactUs/ContactUs.html'));
});
// Rota de API para envio de emails
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        await (0, sendEmail_1.sendContactEmails)({ name, email, message });
        console.log('Emails enviados com sucesso!');
        return res.status(200).json({ message: 'Emails enviados com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao enviar email:', error);
        return res.status(500).json({ message: 'Erro ao enviar emails.' });
    }
});
// Rota genérica para outros arquivos
app.get('*', (req, res) => {
    const filePath = path_1.default.resolve(__dirname, `..${req.path}`);
    if (fs_1.default.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('Página não encontrada');
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
