import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { sendContactEmails } from './functions/sendEmail';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Envio de email
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

// Caminho correto para arquivos estáticos (index.html e componentes)
const staticPath = path.resolve(__dirname, '../pages/index');
app.use(express.static(staticPath));

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
