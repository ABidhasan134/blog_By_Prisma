import { Request, Response } from "express"
import { commentService } from "./comment.service"

const getcommentByAuthorId=async(req:Request,res:Response)=>{
  try{
    const {authorId}=req.params
    const result= await commentService.getCommeteByAuthourID(authorId as string)
    return res.status(200).json({
      success: true,
      message: "Comment retrieved",
      result,
    });
  }catch(error){
    console.log("Error in getCommentById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      result: error,
  })
}}

const getCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId?.trim();
    console.log("comment id from route:", commentId);

    const result = await commentService.getCommentByID(commentId as string);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment retrieved",
      result,
    });
  } catch (error) {
    console.log("Error in getCommentById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      result: error,
    });
  }
};

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

const deleteCommentByID=async(req:Request,res:Response)=>{
  try{
    const id= req.user?.id;
    const {commentId}=req.params;
    console.log("controller console",id,commentId);
    const result = await commentService.deleteCommentService(commentId as string, id as string)
    return res.status(200).json({
            success:true,
            message: "comment delete successfuly",
            result
        })
  }
  catch(error){
console.log("error from the comment creation controller",error)
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            result:error
        })
  }
}

const updatedComment = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    const { commentId } = req.params;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await commentService.updatedCommentService(
      commentId as string,
      req.body,
      id
    );

    if (!result) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this comment"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      result
    });
  } catch (error) {
    console.log("error from the comment update controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error
    });
  }
};



export const commentController={createComment,getCommentById,getcommentByAuthorId,deleteCommentByID,updatedComment}