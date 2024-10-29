const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3001;

app.use(cors()); // Habilita CORS



app.use(bodyParser.urlencoded({ extended: true }));

app.post('/enviar-correo', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Utilizar la variable de entorno para el usuario de Gmail
      pass: process.env.GMAIL_PASSWORD // Utilizar la variable de entorno para la contraseña de Gmail
    }
  });
  const { email, nombre, comentarios } = req.body;

  //res.status(200).send( JSON.stringify({body: req.body}) )
  
  const mailOptions = {
    from: process.env.GMAIL_USER, // Utilizar la variable de entorno para la dirección de Gmail
    to: process.env.GMAIL_RECEIPMENT,
    subject: 'Nuevo formulario recibido '+obtenerFechaActual(),
    text: `Nombre: ${nombre}\nNúmero de contacto: ${email}\n Cuéntame en qué te puedo ayudar: ${comentarios}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(`Error al enviar el correo: ${error.message}`);
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send('Correo enviado con éxito');
  });
  
});

app.post('/enviar-correo-cmec', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CMEC_GMAIL_USER, // Utilizar la variable de entorno para el usuario de Gmail
      pass: process.env.CMEC_GMAIL_PASSWORD // Utilizar la variable de entorno para la contraseña de Gmail
    }
  });
  const { email, nombre, comentarios, contacto, interes } = req.body;

  //res.status(200).send( JSON.stringify({body: req.body}) )
  
  const mailOptions = {
    from: process.env.CMEC_GMAIL_USER, // Utilizar la variable de entorno para la dirección de Gmail
    to: process.env.CMEC_GMAIL_RECEIPMENT,
    subject: '[CMECLIMACHE.CL] Nuevo formulario recibido Fecha: '+obtenerFechaActual(),
    text: `Nombre: ${nombre}\nEmail: ${email}\n Número de contacto: ${contacto}\n Área de interes: ${interes}\n Mensaje: ${comentarios}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(`Error al enviar el correo: ${error.message}`);
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send('Correo enviado con éxito');
  });
  
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const obtenerFechaActual = () => {
  const ahora = new Date();

  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0'); // Nota: Los meses comienzan desde 0
  const anio = ahora.getFullYear();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  const segundos = ahora.getSeconds().toString().padStart(2, '0');

  const fechaFormateada = `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
  return fechaFormateada;
};