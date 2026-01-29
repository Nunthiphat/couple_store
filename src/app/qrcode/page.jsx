"use client";

import Link from "next/link";

export default function QRCodePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 pt-0 -mt-16">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">
          สแกนเพื่อติดต่อสั่งซื้อสินค้า
        </h1>
        <p className="text-gray-500 mb-4 text-sm">
          <span>กรุณาใช้แสกนเนอร์ QR Code เพื่อไปยังบัญชีไลน์</span><br></br>
          <span>สำหรับการติดต่อสั่งซื้อสินค้า</span>
        </p>

        {/* QR Image */}
        <div className="flex justify-center mb-4">
          <img
            src="/Line QRCode.jpg"
            alt="QR Code"
            className="w-60 h-60 object-contain border rounded-lg p-2"
          />
        </div>

        {/* Info
        <p className="text-gray-600 text-sm mb-6">
          หลังจากชำระเงินเรียบร้อย กรุณาเก็บหลักฐานไว้
        </p> */}

        {/* Back Button */}
        <Link
          href="/"
          className="inline-block w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}