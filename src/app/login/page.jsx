"use client"

import { handleLogin } from "@/lib/helper";
import React, { useState } from 'react'
import { useRouter } from "next/navigation";

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
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="text" className="block text-gray-700">Username</label>
            <input type="text" id="text" className="w-full px-3 py-2 border rounded" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 border rounded" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">Login</button>
        </form>
      </div>
    </div> 
  )
}