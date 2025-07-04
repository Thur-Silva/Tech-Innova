import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { sendContactEmails } from './functions/sendEmail';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', '*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Configuração de arquivos estáticos
const publicPath = path.resolve(__dirname, '..');
app.use(express.static(publicPath));

// Servir componentes
app.use('/components', express.static(path.resolve(__dirname, '../components')));

// Rotas para páginas principais
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../pages/index/index.html'));
});

app.get('/ContactUs/ContactUs', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../pages/ContactUs/ContactUs.html'));
});

// Rota de API para envio de emails
app.post('/send-email', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    await sendContactEmails({ name, email, message });
    console.log('Emails enviados com sucesso!');
    return res.status(200).json({ message: 'Emails enviados com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ message: 'Erro ao enviar emails.' });
  }
});

// Rota genérica para outros arquivos
app.get('*', (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, `..${req.path}`);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Página não encontrada');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));