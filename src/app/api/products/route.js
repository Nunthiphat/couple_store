import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Product from "@/models/product"

// ================== GET ==================
export async function GET(req) {
  await connectToDatabase()

  const { searchParams } = new URL(req.url)

  const sort = searchParams.get("sort")
  const time = searchParams.get("time") || "latest"
  const search = searchParams.get("search")

  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "9")
  const skip = (page - 1) * limit

  let query = {}

  if (sort && sort !== "all") {
    query.category = sort
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]
  }

  let sortOption = { createdAt: -1 } // default ล่าสุดก่อน
  if (time === "oldest") sortOption = { createdAt: 1 }

  const total = await Product.countDocuments(query)

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}


// ================== POST (admin only) ==================
export async function POST(req) {
  await connectToDatabase()

  // ✅ อ่าน cookie แบบ App Router
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    )
  }

  // 🔐 ตรวจ role
  if (payload.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    )
  }

  const body = await req.json()

  const product = await Product.create({
    name: body.name,
    description: body.description,
    price: body.price,
    category: body.category,
    images: Array.isArray(body.images) ? body.images : [],
  })

  return NextResponse.json(product)
}
