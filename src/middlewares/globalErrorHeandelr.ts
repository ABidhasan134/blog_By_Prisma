import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";
import { statusCodes } from "better-auth/*";

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  let status=500;
  let errorMessage= 'Internal server Error'
  let errorDetails= err
  if(err instanceof Prisma.PrismaClientInitializationError){
    status=400
    errorMessage='you provide error field type or mising field value'
    errorDetails= err
  }
  else if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code==="p2025"){
      status=400
      errorMessage="An operation failed because it depend on or more records that were rejected"
    }
    if(err.code==="p2002"){
      status=400,
      errorMessage="Duplicate key error"
    }
  }
  res.status(status).json({errorMessage,errorDetails})
}
export default errorHandler