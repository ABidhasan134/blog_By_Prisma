import { NextFunction, Request, Response } from "express"

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).json({message:"error from error hendelar"})
}
export default errorHandler