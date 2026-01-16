"use client";

import Link from "next/link";

export default function QRCodePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">QR Code Page</h1>
        <p className="text-gray-600">
          This is where the QR code functionality will be implemented.
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block px-5 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Back
      </Link>
    </div>
  );
}
