import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { sendContactEmails } from './functions/sendEmail';

dotenv.config();

const app = express();
app.use(express.json());

// Configuração CORS mais segura
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:3001',
  'https://tech-innova.onrender.com/',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configuração de arquivos estáticos
const publicPath = path.resolve(__dirname, '..');
app.use(express.static(publicPath));

// Servir imagens
app.use('/images', express.static(path.resolve(__dirname, '../images')));

// Servir CSS da página de contato
app.use('/ContactUs', express.static(path.resolve(__dirname, '../pages/ContactUs')));


// Rotas para páginas principais
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../pages/index/index.html'));
});

app.get('/contact', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../pages/ContactUs/ContactUs.html'));
});

// Rota de API para envio de emails
app.post('/send-email', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false,
      message: 'Todos os campos são obrigatórios.' 
    });sendContactEmails
  }

  try {
    await ({ name, email, message });
    return res.status(200).json({ 
      success: true,
      message: 'Email enviado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao enviar email. Por favor, tente novamente mais tarde.' 
    });
  }
});

// Rota genérica para outros arquivos
app.get('*', (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, `..${req.path}`);
  
  if (fs.existsSync(filePath) && !filePath.includes('pages')) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Página não encontrada');
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
