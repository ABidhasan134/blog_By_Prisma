import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import sortingAndPagination from "../../helpers/sortingHelper";
import { commentService } from "../comment/comment.service";
import { Post } from "../../../generated/prisma/client";
import { UserRole } from "../../middlewares/auth";


const createPost = async (req: Request, res: Response,next:NextFunction) => {
  try {
    // console.log("coustom user from controller",req.user)
    const result = await postService.createPost(
      req.body,
      req.user?.id as string
    );
    console.log("result from the controller", result);
    return res.status(200).json({ message: "post create successfuly" });
  } catch (error: any) {
    next(error)
  }
};
const getallPost = async (req: Request, res: Response) => {
  try {
    const searchValue = req.query.search;
    const paginationpage=req.query.page
    // const paginationlimit=req.query.limit
    // const page = Number(paginationpage||1);
    // const limit= Number(paginationlimit||0)
    // const skip=(page-1)*limit;
    // const sortBy=req.query.sortBy as string | undefined;
    // const sortOrder=req.query.sortOrder as string | undefined;
    const {page,limit,skip,sortBy,sortOrder}=sortingAndPagination(req.query)
    // console.log("pagination info from the getallpost controller",options)
    const searchString =
      typeof searchValue === "string" ? searchValue : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const parseBoolean = (value?: string): boolean | undefined => {
      if (value === "true") return true;
      if (value === "false") return false;
      return undefined;
    };

    const isFeatured = parseBoolean(req.query.isFeatured as string | undefined);

    const status=req.query.status as PostStatus|undefined
    const authorId=req.query.authorId as string | undefined
    // console.log(authorId)

    const result = await postService.allPostGet({
      searchValue: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });

    console.log("searchvalue from the controller", searchValue);

    return res.status(200).json({
      message: "all post get",
      result: result,
    });
  } catch (error: any) {
    console.log("Internal server error to get all post");
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const getSinglePost=async(req:Request,res:Response)=>{
  try{
    const {postId}=req.params;
    console.log("post id from the controller", postId)
    if(!postId){
      throw new Error("post id is requird");
    }
    const result= await postService.getSingelPostService(postId as string)
    return res.status(200).json({
      success:true,
      message: "single post get successfuly get",
      result
    })
  }
  catch(error){
    console.log("error from the singel post controller",error);
    return res.status(500).json({
      success:false,
      message: 'singel internal post'
    })
  }
}

const getAllPostBysingelUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await postService.getAllPostSingleUserId(user.id);

    return res.status(200).json({
      success: true,
      message: "Single user all posts fetched successfully",
      result
    });
  } catch (error) {
    console.log("error from the single user all post controller", error);
    return res.status(500).json({message:"internal server error",error})
  }}

const updateUserPostByUserId=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {postId}=req.params;
    const user=req.user;
    const postInfo=req.body
    const isAdmin=user?.role===UserRole.admain
    if(!user?.id){
      throw new Error("you have to must log in")
    }
    const result= await postService.updateByUser(postId as string, user?.id as string,postInfo,isAdmin)
  return res.status(200).json({
      success:true,
      message: "post update successfuly ",
      result
    })
  }
  catch(error:any){
 next(error);
  }
}

const deletePostByUserId=async(req:Request,res:Response)=>{
  try{
    const user=req.user;
    const {postId}= req.params
    const isAdmain=user?.role===UserRole.admain
     if(!user?.id){
      throw new Error("you have to must log in")
    }
    console.log("user info",postId,isAdmain)
    const result= await postService.deletePostById(postId as string,user?.id as string,isAdmain)
return res.status(200).json({
      success:true,
      message: "post update successfuly ",
      result
    })
  }
catch (error: any) {
  if (error.message === 'POST_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  if (error.message === 'FORBIDDEN') {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to delete this post",
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

}

const postState=async(req:Request,res:Response)=>{
  try{
    const result= await postService.stateQueries()
    return res.status(200).json({
      success:true,
      message: "post state get successful",
      result
    })
  }
  catch(error){
 return res.status(500).json({
    success: false,
    message: 'Internal server error from state',
  });
  }
}
export const postsController = { createPost, getallPost,getSinglePost,getAllPostBysingelUser,updateUserPostByUserId,deletePostByUserId,postState};
