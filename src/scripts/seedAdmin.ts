import { prisma } from "../lib/prisma"
import { UserRole } from "../middlewares/auth"

export default async function adminSeed() {
  try {
    const adminData = {
      name: "vastora2",
      email: "vastora2@gmail.com",
      password: "vastora1234",
      role: UserRole.admain
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    })

    if (existingAdmin) {
      console.log("Admin already exists")
      return
    }

   const response = await fetch(
  "http://localhost:3000/api/auth/sign-up/email",
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:4000", //  REQUIRED
    },
    body: JSON.stringify(adminData),
  }
)

    console.log("respose from seed admin",response)
    if (!response.ok) {
      const err = await response.text()
      throw new Error(err)
    }

    // Assign admin role AFTER signup
    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true },
    })

    console.log("Admin seeded successfully")
  } catch (error) {
    console.error("Admin seed failed:", error)
  }
}

adminSeed()
