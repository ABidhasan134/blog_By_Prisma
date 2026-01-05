import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

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
  },
});
