import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    // console.log("coustom user from controller",req.user)
    const result = await postService.createPost(
      req.body,
      req.user?.id as string
    );
    console.log("result from the controller", result);
    return res.status(200).json({ message: "post create successfuly" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};
const getallPost = async (req: Request, res: Response) => {
  try {
    const searchValue = req.query.search;
    const searchString =
      typeof searchValue === "string" ? searchValue : undefined;
    const tags= req.query.tags?(req.query.tags as string).split(','):[]
    const result = await postService.allPostGet({ searchValue: searchString, tags});

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
export const postsController = { createPost, getallPost };
