import express, { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

// 🔐 Carrega variáveis do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Altere conforme seu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// 📧 Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 📨 Rota de envio de e-mail
app.post('/send-email', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || 'destino@example.com',
    subject: `Mensagem de ${name}`,
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
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ message: 'Erro ao enviar email.' });
  }
});


// 🔗 Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor backend de e-mail está rodando!');
});

// 🚀 Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
