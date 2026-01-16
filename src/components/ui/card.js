"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import EditProductModal from "@/components/admin/EditProductModal"

const CATEGORY_LABEL = {
    all: "ไม่ระบุ",
    dim: "แบบทึบ",
    clear: "แบบใส",
    glowing: "เรืองแสง",
    fur: "งานขน",
    water: "ตู้น้ำ",
    small: "จิ๋ว",
  }

export default function Card({ product, isAdmin, refresh }) {
  const { _id, name, description, price, category, images = [] } = product
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIndex(0)
  }, [_id])

  const hasImages = images.length > 0
  const currentImage = hasImages
    ? images[index] ?? images[0]
    : "https://via.placeholder.com/400x300?text=No+Image"

  const categoryLabel = CATEGORY_LABEL[category] ?? category

  const prevImage = (e) => {
    e.stopPropagation()
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = (e) => {
    e.stopPropagation()
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleDelete = async () => {
    const ok = confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")
    if (!ok) return

    const res = await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      alert("ลบสินค้าไม่สำเร็จ")
      return
    }

    // ✅ รีเฟรชหน้า Home
    refresh()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden relative"
      >
        {/* Image */}
        <div className="relative w-full h-60 overflow-hidden">
          <img
            src={currentImage}
            alt={name}
            className="w-full h-full object-cover"
          />

          {hasImages && images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
              >
                ◀
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
              >
                ▶
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                ADMIN
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(true)
                }}
                className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded z-10"
              >
                แก้ไข
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="absolute top-12 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded z-10"
              >
                ลบ
              </button>
            </>
          )}
        </div>

        {/* Content */}
        {/* Content */}
        <Link
          href="/qrcode"
          onClick={(e) => open && e.preventDefault()}
          className="block p-4 hover:bg-gray-50 transition space-y-1"
        >
          {/* ชื่อสินค้า */}
          <h2 className="text-xl font-bold leading-snug">
            {name}
          </h2>

          {/* คำอธิบาย (จำกัด 3 บรรทัด + ตัวอักษรใหญ่ขึ้น) */}
          <p className="text-gray-600 text-base line-clamp-3 leading-relaxed">
            {description}
          </p>

          {/* หมวดหมู่ (ใหญ่ขึ้น + ชัดขึ้น) */}
          <p className="text-gray-700 text-base font-medium mt-1">
            หมวดหมู่: <span className="text-gray-900">{categoryLabel}</span>
          </p>

          {/* ราคา */}
          <p className="text-lg font-semibold mt-2 text-blue-600">
            {price} บาท
          </p>
        </Link>

      </motion.div>

      {open && (
        <EditProductModal
          product={product}
          onClose={() => setOpen(false)}
          onSuccess={refresh}
        />
      )}
    </>
  )
}
