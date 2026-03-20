import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    // Initialize mailgen instance with default theme and brand configuration
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "BondedHub",
            link: "https://bondedhub.in",
        },
    });

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    // Generate an HTML email with the provided contents
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    // Create a nodemailer transporter instance which is responsible to send a mail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mail = {
        from: process.env.EMAIL_USER,
        to: options.email, // receiver's mail
        subject: options.subject, // mail subject
        text: emailTextual, // mailgen content textual variant
        html: emailHtml, // mailgen content html variant
    };

    try {
        console.log("mail: ", mail)
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

const emailVerificationMailgenContent = (name, verificationUrl) => {
    return {
        body: {
            name: name,
            intro: "Welcome to our app! We're very excited to have you on board.",
            action: {
                instructions:
                    "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66", 
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro:
                "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const forgotPasswordMailgenContent = (name, passwordResetUrl) => {
    return {
        body: {
            name: name,
            intro: "We got a request to reset the password of our account",
            action: {
                instructions:
                    "To reset your password click on the following button or link:",
                button: {
                    color: "#22BC66",
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro:
                "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
};