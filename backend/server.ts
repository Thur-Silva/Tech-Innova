import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { sendContactEmails } from './functions/sendEmail';

dotenv.config();

const app = express();
app.use(express.json());

// Ajuste o origin para o domínio que vai usar na Render, pode ser '*' se quiser liberar geral
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', '*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Servir arquivos estáticos da pasta ../pages/index
app.use(express.static(path.join(__dirname, '../pages/index')));

// Endpoint para envio de email
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

// Para todas as outras rotas, enviar o index.html (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../pages/index/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
