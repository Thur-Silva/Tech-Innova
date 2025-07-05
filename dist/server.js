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
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:3001',
    'https://tech-innova.onrender.com',
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Servir arquivos estáticos (recomendo usar pasta pública específica)
const publicPath = path_1.default.resolve(__dirname, '../components'); // se tiver uma pasta public
app.use(express_1.default.static(publicPath));
// Servir imagens
app.use('/images', express_1.default.static(path_1.default.resolve(__dirname, '../images')));
// Servir ContactUs
app.use('/ContactUs', express_1.default.static(path_1.default.resolve(__dirname, '../pages/ContactUs')));
// Servir QuizService
app.use('/QuizService', express_1.default.static(path_1.default.resolve(__dirname, '../pages/QuizService')));
// Rotas para páginas principais
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../pages/index/index.html'));
});
app.get('/quiz', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../pages/QuizService/QuizService.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../pages/ContactUs/ContactUs.html'));
});
// Rota de envio de email
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios.'
        });
    }
    try {
        await (0, sendEmail_1.sendContactEmails)({ name, email, message });
        return res.status(200).json({
            success: true,
            message: 'Email enviado com sucesso!'
        });
    }
    catch (error) {
        console.error('Erro ao enviar email:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao enviar email. Por favor, tente novamente mais tarde.'
        });
    }
});
// Rota genérica (opcional, pode ajustar conforme necessidade)
app.get('*', (req, res) => {
    const filePath = path_1.default.resolve(__dirname, `..${req.path}`);
    if (fs_1.default.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('Página não encontrada');
    }
});
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
