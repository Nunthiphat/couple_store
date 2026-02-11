"use client"
import { useState } from "react"
import Link from "next/link"

const MAX_IMAGES = 5

export default function AdminPage() {
  const [images, setImages] = useState([])

  /* =======================
     เพิ่มรูป (append)
  ======================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (images.length + files.length > MAX_IMAGES) {
      alert(`เพิ่มรูปได้ไม่เกิน ${MAX_IMAGES} รูป`)
      return
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })

    // reset input เพื่อเลือกไฟล์เดิมซ้ำได้
    e.target.value = ""
  }

  /* =======================
     ลบรูป
  ======================= */
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  /* =======================
     Submit
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      name: e.target.name.value,
      description: e.target.description.value,
      price: Number(e.target.price.value),
      category: e.target.category.value,
      images, // ✅ base64[]
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      alert("เกิดข้อผิดพลาด")
      return
    }

    alert("เพิ่มสินค้าเรียบร้อย 🎉")
    e.target.reset()
    setImages([])
  }

  return (
    <div>
      <h1 className="my-10 text-2xl font-bold text-center">เพิ่มสินค้า</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-8 space-y-4 bg-white shadow rounded-md"
      >
        <input
          name="name"
          placeholder="ชื่อสินค้า"
          className="border p-2 w-full rounded"
          required
        />

        <textarea
          name="description"
          placeholder="คำอธิบาย"
          className="border p-2 w-full rounded"
        />

        <input
          name="price"
          type="number"
          step="any"
          min="0"
          placeholder="ราคา"
          className="border p-2 w-full rounded"
          required
        />

        <select name="category" className="border py-2 w-full rounded">
          <option value="all">ทั้งหมด</option>
          <option value="dim">แบบทึบ</option>
          <option value="clear">แบบใส</option>
          <option value="glowing">เรืองแสง</option>
          <option value="fur">งานขน</option>
          <option value="water">ตู้น้ำ</option>
          <option value="small">จิ๋ว</option>
        </select>

        {/* เพิ่มรูป */}
        <label
          htmlFor="images"
          className="cursor-pointer border p-2 block text-center text-gray-600 rounded"
        >
          📁 เพิ่มรูปภาพ ({images.length}/{MAX_IMAGES})
        </label>

        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="hidden"
        />

        {/* Preview + ลบ */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  className="h-24 w-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="bg-orange-400 text-white w-full py-2 rounded hover:bg-orange-500 transition">
          เพิ่มสินค้า
        </button>
      </form>

      <div className="text-center mt-4">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          กลับไปหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
