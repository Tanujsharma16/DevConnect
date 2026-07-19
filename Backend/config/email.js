const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
    sendMail: async ({ to, subject, text, html }) => {
        const { data, error } = await resend.emails.send({
            from: "DevConnect <onboarding@resend.dev>",
            to,
            subject,
            text,
            html,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },
};

module.exports = transporter;