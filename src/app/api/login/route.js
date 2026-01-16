import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"

export async function POST(req) {
  const { username, password } = await req.json()

  await connectToDatabase()

  const user = await User.findOne({ username })
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  const response = NextResponse.json({ message: "Login successful" })

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}
