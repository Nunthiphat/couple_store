import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(req) {
  const { username, password } = await req.json()

  // mock user data
  const user = {
    _id: "1",
    username: "admin@test.com",
    passwordHash: bcrypt.hashSync("1234", 10),
    role: "admin",
  }

  // ✅ ตรวจ username
  if (username !== user.username) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  // ✅ ตรวจ password
  const isMatch = bcrypt.compareSync(password, user.passwordHash)
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  // ✅ สร้าง token (อยู่นอก if แล้ว)
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  // console.log("Generated JWT token:", token)

  const response = NextResponse.json({ message: "Login successful" })

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}
