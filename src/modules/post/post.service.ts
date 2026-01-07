import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
   console.log("user id from service",userId)
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  })

  return result
}

export const postService = { createPost }
