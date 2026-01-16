import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/product"

/* =======================
   Helper: Auth Guard
======================= */
async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { error: "Unauthorized", status: 401 }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== "admin") {
      return { error: "Forbidden", status: 403 }
    }

    return { decoded }
  } catch {
    return { error: "Invalid token", status: 401 }
  }
}

/* =======================
   UPDATE PRODUCT
======================= */
export async function PUT(req, { params }) {
  await connectToDatabase()

  const auth = await requireAdmin()
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    )
  }

  // ✅ สำคัญมาก
  const { id } = await params

  const body = await req.json()

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      images: Array.isArray(body.images) ? body.images : [],
    },
    { new: true }
  )

  if (!updated) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(updated)
}

/* =======================
   DELETE PRODUCT
======================= */
export async function DELETE(req, { params }) {
  await connectToDatabase()

  const auth = await requireAdmin()
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    )
  }

  // ✅ ถูกต้องแล้ว
  const { id } = await params

  const deleted = await Product.findByIdAndDelete(id)

  if (!deleted) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
