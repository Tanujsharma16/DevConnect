const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = {
    sendMail: async ({to, subject, text, html}) => {
        try {
    await sgMail.send({
        to,
        from: "tumhari_verified_email@gmail.com",
        subject,
        text,
        html
    });

} catch (err) {
    console.log(
        "SENDGRID ERROR DETAIL:",
        JSON.stringify(err.response.body.errors, null, 2)
    );

    throw err;
}
    }
};

module.exports = transporter;