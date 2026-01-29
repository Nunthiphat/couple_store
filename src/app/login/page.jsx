"use client"

import { handleLogin } from "@/lib/helper";
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const[username, setUsername] = useState("");
  const[password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin(username, password);

    if (success) {
      router.push("/admin"); // ✅ พาไป admin
    } else {
      alert("Email หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="text" className="block text-gray-700">ชื่อผู้ใช้</label>
            <input type="text" id="text" className="w-full px-3 py-2 border rounded" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">รหัสผ่าน</label>
            <input type="password" id="password" className="w-full px-3 py-2 border rounded" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">เข้าสู่ระบบ</button>
        </form>
        <Link
          href="/"
          className="block w-full text-center mt-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div> 
  )
}