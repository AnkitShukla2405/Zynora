import nodemailer, { Transporter } from "nodemailer";

export const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_MAIL as string,
        pass: process.env.SMTP_PASS as string,
    },
})