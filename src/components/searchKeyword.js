"use client"

import { useSearchParams } from "next/navigation"

export default function SearchKeyword() {
  const searchParams = useSearchParams()
  const search = searchParams.get("search")

  if (!search) return null

  return (
    <h1 className="flex justify-center font-bold text-gray-500">
      ผลการค้นหา: <span className="font-semibold">"{search}"</span>
    </h1>
  )
}
