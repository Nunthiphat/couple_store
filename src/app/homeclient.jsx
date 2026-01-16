"use client"

import React, { useState, useEffect } from "react"
import Card from "@/components/ui/card"
import { GuestNavbar, AdminNavbar } from "../components/navbar"
import { useSearchParams } from "next/navigation"
import SearchKeyword from "@/components/searchKeyword"

export default function HomeClient() {
  const [products, setProducts] = useState([])
  const [sort, setSort] = useState("all")
  const [time, setTime] = useState("latest") // ✅ default ล่าสุดก่อน
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""


  // pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // ================= auth =================
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null))
  }, [])

  const isAdmin = user?.authenticated && user?.role === "admin"

  // ================= fetch products =================
  const fetchProducts = async (reset = false) => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      params.append("page", reset ? 1 : page)
      params.append("limit", 9)

      if (sort !== "all") params.append("sort", sort)
      if (time) params.append("time", time)

      if (search) params.append("search", search)

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      const newProducts = Array.isArray(data.products)
        ? data.products
        : []

      setProducts(prev =>
        reset ? newProducts : [...prev, ...newProducts]
      )

      setTotalPages(data.pagination?.totalPages || 1)

    } catch (err) {
      console.error("Fetch error:", err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // ================= reset เมื่อ filter เปลี่ยน =================
  useEffect(() => {
    setPage(1)
    fetchProducts(true)
  }, [sort, time, search])

  // ================= load more =================
  const loadMore = () => {
    if (page < totalPages) {
      setPage(p => p + 1)
    }
  }

  useEffect(() => {
    if (page > 1) fetchProducts()
  }, [page])

  return (
    <div>
      {isAdmin ? <AdminNavbar /> : <GuestNavbar />}

      {/* {search && (
        <p className="px-8 mb-2 text-sm text-gray-500">
          ผลการค้นหา: <span className="font-semibold">"{search}"</span>
        </p>
      )}  */}

      {/* ===== Filter Bar ===== */}
      <div className="px-8 pb-8 flex justify-between items-center pt-20">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 bg-white rounded"
        >
          <option value="all">ทั้งหมด</option>
          <option value="dim">แบบทึบ</option>
          <option value="clear">แบบใส</option>
          <option value="glowing">เรืองแสง</option>
          <option value="fur">งานขน</option>
          <option value="water">ตู้น้ำ</option>
          <option value="small">จิ๋ว</option>
        </select>

        <SearchKeyword />

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border px-3 py-2 bg-white rounded"
        >
          <option value="latest">ล่าสุด → เก่าที่สุด</option>
          <option value="oldest">เก่าที่สุด → ล่าสุด</option>
        </select>
      </div>

      {/* ===== Content ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 px-8 gap-6 mb-10">
        {Array.isArray(products) && products.map((p) => (
          <Card
            key={p._id}
            product={p}
            isAdmin={isAdmin}
            refresh={() => fetchProducts(true)}
          />
        ))}
      </div>

      {/* ===== Load More ===== */}
      {page < totalPages && (
        <div className="flex justify-center mb-10">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "กำลังโหลด..." : "โหลดเพิ่ม"}
          </button>
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500 mb-10">
          ไม่มีสินค้า
        </p>
      )}
    </div>
  )
}
