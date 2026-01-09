import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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
const allPostGet = async (payload: {
  searchValue: string | undefined;
  tags: string[] | [];
  isFeatured:boolean | undefined,
  status:PostStatus|undefined,
  authorId:string | undefined
}) => {
  // console.log("get all the post from service",);
  const conditionArray:PostWhereInput[] = [];
  if (payload.searchValue) {
    conditionArray.push({
      OR: [
        {
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
      ],
    });
  }
  if (payload.tags.length > 0) {
    conditionArray.push({
      tags: {
        hasEvery: payload.tags
      }
    })
  }
  if(typeof payload.isFeatured==='boolean'){
    conditionArray.push({isFeatured:payload.isFeatured})
  }
  if(payload.status){
    conditionArray.push({status:payload.status})
  }
  if(payload.authorId){
    conditionArray.push({authorId:payload.authorId})
  }
  const allpost = await prisma.post.findMany({
    where: {
      AND: conditionArray,
    },
  });
  console.log("search result from the service", allpost);
  return allpost;
};

export const postService = { createPost, allPostGet };
