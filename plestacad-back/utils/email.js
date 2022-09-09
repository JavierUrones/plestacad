const { verify } = require("jsonwebtoken");
const nodemailer = require("nodemailer");


 function generateVerifyToken(){
    var token = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 128; i++){
        randomPos = Math.floor(Math.random() * characters.length)
        token += (characters.charAt(randomPos));
    }

    return token;
}
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
    to: "gacevew301@seinfaq.com",
    subject: "Verifica tu cuenta de usuario en Plestacad",
    text: "¡Bienvenido a Plestacad! Para poder verificar tu cuenta en la plataforma es necesario que accedas al siguiente enlace: " + '<a href='+process.env.URL_SERVER+'/api/verify/' + verifyToken.toString() + "aquí</a>",
    html: "<h1>¡Bienvenido a Plestacad!</h1> <p>Saludos " + user.name + ",</p> <p> Para poder verificar tu cuenta en la plataforma es necesario que accedas al siguiente enlace: " + '<a href='+process.env.URL_SERVER+'/api/verify/'+ verifyToken.toString() + '>aquí</a>',
  });
  console.log("Mensaje enviado:", info.messageId);
}



module.exports.sendEmailConfirmation = sendEmailConfirmation;
module.exports.generateVerifyToken = generateVerifyToken;
