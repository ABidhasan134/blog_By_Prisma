import { Request, Response } from "express"

const routeNotFound = (req:Request,res:Response) => {
 res.status(404).json({
    message:"route not found",
    path: req.originalUrl,
    date:Date()
 })
}

export default routeNotFound
