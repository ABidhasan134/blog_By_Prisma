import { Request, Response } from "express";


const createPost=async(req:Request,res:Response)=>{
    try{
        return res.status(200).json({message:"post create successfuly"})
    }
    catch(error:any){
        return res.status(500).json({
            message:"Internal server error",
            error: error
        })
    }
}

export const postsController={createPost}