import{ NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerrify: boolean;
      };
    }
  }
}
export enum UserRole {
  user = "user",
  admain = "admain",
}
export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
  try{
      const session = await betterAuth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

  
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    //  Email not verified
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required",
      });
    }

    // Attach user
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerrify: session.user.emailVerified,
    };

    //  Role not allowed
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    //  All checks passed
    next();
  }catch(error){
    console.log("error from the auth middlewares")
    throw error
  }
  };
};