const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = {
    sendMail: async ({to, subject, text, html}) => {
        try {
            await sgMail.send({
                to,
                from: "tanujpandit16q@gmail.com",
                subject,
                text,
                html
            });
        } catch(err) {
            console.log(
              "SENDGRID ERROR:",
              err.response.body.errors
            );
            throw err;
        }
    }
};

module.exports = transporter;