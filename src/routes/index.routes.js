const express = require('express')
const serveIndex = require('serve-index')
const path = require('path')
require('dotenv').config()
const nodeMailer = require('nodemailer')

const {
    Router
} = require('express');
const router = Router();

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
   
    auth: {
        user: process.env.HOST,
        pass: process.env.PASS,
    },

});



const User = require('../models/user');

router.get('/', (req, res) => {

    User.find((err, users) => {
        if (err) {
            return res.statusCode(400).json({
                err
            });
        }

        if (users.length != 0 ) {
           return res.render('index.ejs', {
                path: "Users",
                users
            });
        } else {
          const usuarios = [{
                nombre: "Tania Alejandra Bonilla ALfaro",
                codigo: "USIS055618"
            }, {
                nombre: "Arely Stephany Ramos Lemus",
                codigo: "USIS008918"
            }, {
                nombre: "Cristina Fabiola Rivera Vargas",
                codigo: "USIS023618"
            }];


            usuarios.forEach(element => {
                const local = new User(element);
                local.save((err) => {
                    if (err) {
                        console.log("Error al Guardar el usuario");
                    }
                    console.log('guardado')
                });
            });

            User.find((err, users) => {
                if (err) {
                    return res.statusCode(400).json({
                        err
                    });
                }

                res.render('index.ejs', {
                    path: "Users",
                    users
                });
            });

        }
    });
});

router.get('/smtp', (req, res) => {
    return res.render('ftp.ejs', {
        path: "SMTP"
    });
});

router.post('/smtp', async (req, res) => {
    const { mail } = req.body;
    const msg = {
        to: mail,
        from: process.env.HOST + ` ${process.env.HOST}`, // Use the email address or domain you verified above
        subject: 'Enviando mensaje SMTP',
        text: '',
        html: `
            <strong>
           <h1> parcial III</h1>
           <p>sorftware libre<p>

            <h2>Integrantes del grupo</h3>
            <hr/>
                <ul>
                    <li>Tania Alejandra Bonilla ALfaro USIS055618</li>
                    <li>Arely Stephany Ramos Lemus USIS008918</li>
                    <li>Cristina Fabiola Rivera Vargas USIS023618</li>
                    </ul>
            </strong>`,
    };

    try {
        // await sgMail.send(msg);
        await transporter.sendMail(msg)
        res.redirect('/')
    } catch (error) {
        if (error.response) {
            console.error(error.response.body)
        }
        console.log(error)
    }

});

router.use('/ftp-route',
    express.static(path.join(process.cwd(),
        '/src/public')
    ),
    serveIndex(path.join(process.cwd(),
        '/src/public'), { icons: true }
    )
);

module.exports = router;
console.log(path.join(process.cwd(), '/src/public'))