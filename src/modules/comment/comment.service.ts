import { prisma } from "../../lib/prisma";


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
export const commentService={createCommentService}