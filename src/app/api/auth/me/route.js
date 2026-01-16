import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET() {
  const tokenStore = await cookies()
  const token = tokenStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return NextResponse.json({
      authenticated: true,
      role: decoded.role,   // ✅ ส่ง role
      userId: decoded.userId,
    })
    
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
