const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Utilizar la variable de entorno para el usuario de Gmail
    pass: process.env.GMAIL_PASSWORD // Utilizar la variable de entorno para la contraseña de Gmail
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/enviar-correo', (req, res) => {
  const { email, nombre, comentarios } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER, // Utilizar la variable de entorno para la dirección de Gmail
    to: process.env.GMAIL_RECEIPMENT,
    subject: 'Nuevo formulario recibido',
    text: `Nombre: ${nombre}\nEmail: ${email}\nComentarios: ${comentarios}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(`Error al enviar el correo: ${error.message}`);
    }

    res.status(200).send('Correo enviado con éxito');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});