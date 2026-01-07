import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// import { sendEmail } from "./email";
import nodemailer from "nodemailer"

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abeydhasan134@gmail.com",
    pass: "ldnuivkanyizrtag", 
  },
});

if (!process.env.FRONTEND_PORT_OR_POSTMAN_ORIGIN) {
  throw new Error("FRONTEND_PORT_OR_POSTMAN_ORIGIN is not defined");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.FRONTEND_PORT_OR_POSTMAN_ORIGIN],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn:false,
    requireEmailVerification:true
  },
     emailVerification: {
    sendVerificationEmail: async ({ user, url,token }) => {
      try{
        console.log(`here is the token ${token} and user${url}`)
      const verificationURL=`${process.env.FRONTEND_PORT_OR_POSTMAN_ORIGIN}/veryfy-email/token=${token}`
      const info = await transporter.sendMail({
    from: '"vastora@gmail.com',
    to: "abeydhasan134@gmail",
    subject: "Email verification",
    text: "Email verification", 
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Verify Your Email</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size:24px;">Prisma Blog App</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333;">
                    <p style="font-size:16px;">Hello <strong>${user.email}</strong>,</p>

                    <p style="font-size:15px; line-height:1.6;">
                      Thank you for creating an account. Please verify your email address
                      by clicking the button below.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${verificationURL}"
                        style="
                          background:#4f46e5;
                          color:#ffffff;
                          text-decoration:none;
                          padding:14px 28px;
                          border-radius:6px;
                          font-size:16px;
                          display:inline-block;
                        ">
                        Verify Email
                      </a>
                    </div>

                    <p style="font-size:14px; color:#666;">
                      If the button doesn’t work, copy and paste this link into your browser:
                    </p>

                    <p style="font-size:13px; word-break:break-all; color:#4f46e5;">
                      ${verificationURL}
                    </p>

                    <p style="font-size:14px; color:#666; margin-top:30px;">
                      This link will expire soon for security reasons.
                    </p>

                    <p style="font-size:14px;">
                      — Prisma Blog App Team
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#888;">
                    © ${new Date().getFullYear()} Prisma Blog App. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });

  console.log("Message sent:", info.messageId);

      }catch(error){
        console.log("email verification error")
        throw error
      }
    },
  },
   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            accessType: "offline", 
            prompt: "select_account consent",
        }, 
    }
});
