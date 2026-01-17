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
  authorId:string | undefined,
   page:number,
   limit:number,
   skip:number,
   sortBy: string | undefined,
   sortOrder:string | undefined
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
    take:payload.limit,
    skip:payload.skip,
    where: {
      AND: conditionArray,
    },
    orderBy: payload.sortBy && payload.sortOrder
    ? { [payload.sortBy]: payload.sortOrder }
    : { createdAt: "desc" },
      include:{
        _count:{select:{comments:true}}
      }

  }
  );
  const total= await prisma.post.count({
     where: {
      AND: conditionArray,
    },
  })
  console.log("search result from the service", allpost);
  return {
    date:allpost,
    pagination:{
      total,
      page:payload.page,
      limit:payload.limit,
      totalPage: Math.ceil(total/payload.limit)
    }
  };
};
const getSingelPostService=async(postId:string)=>{
  console.log("get single service ",postId)
  const result =await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        viewCount: { increment: 1 },
      },
    });

  return tx.post.findUnique({
  where: { id: postId },
  include: {
    comments: {
      where: {
        parentId: null, // top-level comments
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            replies: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    },
    _count:{
      select:{comments:true}
    }
  },
});


  });
  console.log("get single service ",result)
  return result
}

const getAllPostSingleUserId=async(id:string)=>{
  const post = await prisma.post.findFirst({
  where: {
    authorId: id,
    status: PostStatus.ARCHIVED
  }
});

if (!post) {
  // handle empty state
  return null
}
  const result= await prisma.post.findMany({
    where:{
     authorId:id 
    },
    orderBy:{createdAt:'desc'},
    include:{
      _count:{
        select:{comments:true}
      }
    }
  })
  const total= await prisma.post.count({
    where:{authorId:id}
  })
  return {result,total}
}

const updateByUser = async (
  postId: string,
  authorId: string,
  data: Partial<Post>,
  isAdmin: boolean
) => {
  const postInfo = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!postInfo) {
    throw new Error('Post not found');
  }

  // ownership check
  if (!isAdmin && postInfo.authorId !== authorId) {
    throw new Error('This post is not yours');
  }

  // user cannot update admin-only fields
  if (!isAdmin) {
    delete data.isFeatured;
  }

  return prisma.post.update({
    where: { id: postId },
    data,
  });
};

const deletePostById = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postInfo = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!postInfo) {
    throw new Error('POST_NOT_FOUND');
  }

  if (!isAdmin && postInfo.authorId !== authorId) {
    throw new Error('FORBIDDEN');
  }

  return prisma.post.delete({
    where: { id: postId },
  });
};

export const postService = { createPost, allPostGet,getSingelPostService,getAllPostSingleUserId,updateByUser,deletePostById};
