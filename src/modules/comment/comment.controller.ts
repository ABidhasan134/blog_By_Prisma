import { Request, Response } from "express"
import { commentService } from "./comment.service"

const createComment=async(req:Request,res:Response)=>{
    try{
        // const postInfo=req.body
        // console.log("post info from the controller",postInfo);
        const user= req.user
        req.body.authorId=user?.id
        const result= await commentService.createCommentService(req.body)
        return res.status(200).json({
            success:true,
            message: "comment create successfuly",
            result
        })
    }catch(error){
        console.log("error from the comment creation controller",error)
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            result:error
        })
    }
}

export const commentController={createComment}