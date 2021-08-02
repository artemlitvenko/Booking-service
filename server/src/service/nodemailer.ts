import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    },
    {
        from: 'Clockwise Service <clockwise.service.info@gmail.com>',
    },
);

export const mailer = (message: any) => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err);
        console.log('Email sent: ', info);
    });
};
