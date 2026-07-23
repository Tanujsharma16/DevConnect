const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = {
    sendMail: async ({ to, subject, text, html }) => {

        const msg = {
            to,
            from: "tanujpandit16q@gmail.com",
            subject,
            text,
            html,
        };

        await sgMail.send(msg);
    },
};

module.exports = transporter;