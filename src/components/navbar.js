"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function GuestNavbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const [query, setQuery] = useState(currentSearch)

  // 🔄 sync เมื่อกด back / ลิงก์
  useEffect(() => {
    setQuery(currentSearch)
  }, [currentSearch])

  const handleSearch = (e) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/") // ✅ กลับไปแสดงทั้งหมด
    }
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-100/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        
        {/* Logo / Title */}
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold text-gray-800 tracking-wide">
          Couple&apos;s Shop
        </h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ค้นหาสินค้า"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* ปุ่มล้าง */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  router.push("/")
                }}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-red-500
                  text-sm
                "
              >
                ✕
              </button>
            )}
          </div>
        
          <button
            type="submit"
            className="rounded-md bg-gray-800 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white hover:bg-gray-700 transition"
          >
            ค้นหา
          </button>
          
        </form>
        <div className="flex items-center gap-4">
          <Link href="/login" type="button" className="border rounded-md px-3 py-1.5 text-sm sm:text-base bg-orange-500 text-gray-700 hover:text-gray-900 hover:bg-orange-600">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </header>
  )
}

export function AdminNavbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const [query, setQuery] = useState(currentSearch)

  // 🔄 sync เมื่อกด back / ลิงก์
  useEffect(() => {
    setQuery(currentSearch)
  }, [currentSearch])

  const handleSearch = (e) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/") // ✅ กลับไปแสดงทั้งหมด
    }
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-100/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold text-gray-800 tracking-wide">
          Couple&apos;s Shop
        </h1>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ค้นหาสินค้า"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* ปุ่มล้าง */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  router.push("/")
                }}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-red-500
                  text-sm text-bold
                "
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-gray-800 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white hover:bg-gray-700 transition"
          >
            ค้นหา
          </button>
        </form>
        <div className="flex items-center gap-4">
          <Link href="/admin" type="button" className="border rounded-md px-3 py-1.5 text-sm sm:text-base bg-orange-500 text-gray-700 hover:text-gray-900 hover:bg-orange-600">Add</Link>
        </div>
      </div>
    </header>
  )
}