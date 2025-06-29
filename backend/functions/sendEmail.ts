// backend/functions/sendEmail.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do transportador Nodemailer
const transporter = nodemailer.createTransport({
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

interface EmailData {
    name: string;
    email: string;
    message: string;
}

export async function sendContactEmail(data: EmailData) {
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