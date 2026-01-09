import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  console.log("user id from service", userId);
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};
const allPostGet = async (payload: { searchValue: string | undefined ,tags:string[]|[]}) => {
  // console.log("get all the post from service",);
   const allpost = await prisma.post.findMany({
    where: {
      AND:[
       { OR: [
        payload.searchValue&&{
          title: {
            contains: payload.searchValue as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.searchValue as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.searchValue as string,
          },
        },
      ]},
      {tags:{
        hasEvery:payload.tags
      }}
      ]
    },
  });
  console.log("search result from the service", allpost);
  return allpost;
};

export const postService = { createPost, allPostGet };
