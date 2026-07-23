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

} catch (err) {
    console.log(
        "SENDGRID ERROR DETAIL:",
        JSON.stringify(err.response?.body, null, 2)
    );

    throw err;
}
    }
};

module.exports = transporter;