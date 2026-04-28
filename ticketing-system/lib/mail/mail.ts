import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export async function sendVerificationEmail(to: string, otp: string) {
    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">TICKETRUSH</h2>
        <p>Use the code below to verify your account. It expires in 5 minutes.</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
            ${otp}
        </div>
        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
            If you didn't request this, ignore this email.
        </p>
        </div>
    `;

    try {
        await transporter.sendMail({
        from: '"TicketRush" <noreply@ticketrush.com>',
        to,
        subject: "Verify your email",
        html: htmlContent,
        });
        return { success: true };
    } catch (error) {
        console.error("Nodemailer Error:", error);
        return { success: false };
    }
}