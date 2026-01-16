"use client"

import { useState } from "react"

export default function EditProductModal({ product, onClose, onSuccess }) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)
  const [category, setCategory] = useState(product.category)

  const MAX_IMAGES = 5

  // รูปเดิม
  const [images, setImages] = useState(product.images || [])

  // รูปใหม่
  const [newImages, setNewImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let base64Images = []

    // ⭐ แปลงรูปใหม่เป็น base64
    for (const file of newImages) {
      const base64 = await fileToBase64(file)
      base64Images.push(base64)
    }

    // ⭐ รวมรูปเดิม + รูปใหม่
    const finalImages = [...images, ...base64Images]

    const payload = {
      name,
      description,
      price,
      category,
      images: finalImages,
    }

    const res = await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      alert("บันทึกไม่สำเร็จ")
      setLoading(false)
      return
    }

    setLoading(false)
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <h2 className="text-xl font-bold mb-4">แก้ไขสินค้า</h2>

        {error && (
          <p className="text-red-600 mb-3 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">ไม่ระบุ</option>
            <option value="dim">แบบทึบ</option>
            <option value="clear">แบบใส</option>
            <option value="glowing">เรืองแสง</option>
            <option value="fur">งานขน</option>
            <option value="water">ตู้น้ำ</option>
            <option value="small">จิ๋ว</option>
          </select>

          {/* รูปเดิม */}
          <div>
            <p className="font-semibold mb-1">รูปปัจจุบัน</p>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="h-24 w-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* preview รูปใหม่ */}
          {newImages.length > 0 && (
            <div>
              <p className="font-semibold mb-1">รูปใหม่</p>
              <div className="grid grid-cols-3 gap-2">
                {newImages.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label
            htmlFor="images"
            className="cursor-pointer border p-2 block text-center text-gray-600 rounded"
          >
            📁 เพิ่มรูปภาพ ({images.length}/{MAX_IMAGES})
          </label>

          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files)
              const remain = MAX_IMAGES - images.length - newImages.length
              if (remain <= 0) return

              setNewImages(prev => [...prev, ...files.slice(0, remain)])
            }}
            className="hidden"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
