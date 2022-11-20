/** Módulo encargado de la gestión del envío de correos electrónicos.
 * @module utils/email
 */
/**
 * Módulo nodemailer para enviar correos electrónicos.
 */
const nodemailer = require("nodemailer");


/**
 * Genera una cadena de verificación para el usuario recien registrado.
 * @returns Retorna la cadena de verificación del usuario.
 */
 function generateVerifyToken(){
    var token = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 128; i++){
        randomPos = Math.floor(Math.random() * characters.length)
        token += (characters.charAt(randomPos));
    }

    return token;
}
/**
 * Envía un correo de verificación al usuario que se acaba de registrar.
 * @param {User} user - datos del usuario recién registrado
 * @param {string} verifyToken - cadena de verificación del usuario
 */
 async function sendEmailConfirmation(user, verifyToken) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
      user: process.env.USER_EMAIL_NODEMAILER,
      pass: process.env.PASSWORD_EMAIL_NODEMAILER, 
    },
  });
  let info = await transporter.sendMail({
    from: '"Plestacad" <' + process.env.USER_EMAIL_NODEMAILER + '>',
    to: user.email,
    subject: "Verifica tu cuenta de usuario en Plestacad",
    text: "¡Bienvenido a Plestacad! Para poder verificar tu cuenta en la plataforma es necesario que accedas al siguiente enlace: " + '<a href='+process.env.URL_SERVER+'/api/verify/' + verifyToken.toString() + "aquí</a>",
    html: "<h1>¡Bienvenido a Plestacad!</h1> <p>Saludos " + user.name + ",</p> <p> Para poder verificar tu cuenta en la plataforma es necesario que accedas al siguiente enlace: " + '<a href='+process.env.URL_SERVER+'/api/verify/'+ verifyToken.toString() + '>aquí</a>',
  });
}



module.exports.sendEmailConfirmation = sendEmailConfirmation;
module.exports.generateVerifyToken = generateVerifyToken;
