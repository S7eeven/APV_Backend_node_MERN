import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
    });

    //console.log(datos);
    const { email, nombre, token } = datos;
    //Enviar el Email para CONFIRMAR cuenta
    const info = await transporter.sendMail({
       from: "APV - Administrador de pacientes de veterinaria",
       to: email,
       subject: "Restablece tu password",
       text: "Restablece tu password",
       html: ` <p>Hola: ${nombre}, has solicitado restablecer tu password. </p>

        <p>Sigue el siguiente enlace para generar un nuevo password: 
            <a href="${process.env.FRONTEND_URL}/olvidePassword/${token}">Restablecer password</a> </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>       
        `,
    });

    console.log("Mensaje enviado: %s", info.messageId);

};

export default emailOlvidePassword

