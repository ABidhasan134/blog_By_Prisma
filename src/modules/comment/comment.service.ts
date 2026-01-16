
import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getCommeteByAuthourID=async(authorId:string)=>{
    const result= await prisma.comment.findMany({
        where:{
            authorId:authorId
        },
        orderBy:{createdAt:'desc'},
        include:{
            post:{
                select:{id:true,title:true}
            }
        }
    })
    console.log("this is form the author Id getting", result)
    return result;
}

const getCommentByID = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: { id: id.trim() // remove whitespace
     },
       include:{
        post:{
            select:{id:true,title:true}
        }
       }
  });
  console.log("Comment from service:", result);
  return result;
};


const createCommentService=async(payload:{
    postId:string,
    content:string,
    authorId:string,
    parentId?:string
})=>{
    console.log("comment service",payload);
   await prisma.post.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    })
    if(payload.parentId){
       await prisma.comment.findFirstOrThrow({
            where:{
                id:payload.parentId
            }
        })
    }
    const result = await prisma.comment.create({
        data:payload
    })
    return result
}

const deleteCommentService=async(commentId:string,id:string)=>{
    const commentInfo= await prisma.comment.findUnique({
        where:{
            id : commentId
        }
    })
    if(id!==commentInfo?.authorId){
        console.log("author match info from the srvice", commentInfo);
        return null
    }
    console.log("No author info from the srvice", commentInfo);

    const result= await prisma.comment.delete({
        where:{
            id:commentId
        }
    })
    return result;
}

const updatedCommentService = async (
  commentId: string,
  data: { content?: string; status?: commentStatus },
  id: string
) => {
  const commentInfo = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: id
    }
  });

  if (!commentInfo) {
    return null;
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId
    },
    data
  });

  return result;
};

const commentStatusOnlyAdmain=async(commentId:string,status:commentStatus)=>{
    const commentInfo = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })
    if(commentInfo.status===status){
        throw new Error(`your status already update ${status}`)
    }
    console.log("comment status service",commentInfo)
    return await prisma.comment.update({
        where: { id: commentId},
        data:{status:status}
    })
}

export const commentService={createCommentService,getCommentByID,getCommeteByAuthourID,deleteCommentService,updatedCommentService,commentStatusOnlyAdmain}