"use client"

import { Scanner } from "@yudiel/react-qr-scanner"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { apiClient } from "@/api/axios"
import { generateToken } from "@/lib/generate-token"

export default function QrCameraPage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState("Scan QR from desktop")

  const approveQr = async (raw: string) => {
    try {
      if (!session?.currentUser) {
        return setMessage("Please login first")
      }

      const url = new URL(raw)
      const qrId = url.searchParams.get("qrId")

      if (!qrId) {
        return setMessage("Invalid QR")
      }

      const token = await generateToken(session.currentUser)

      await apiClient.post("/qr/approve", { qrId }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setMessage("✅ Login approved. Return to desktop.")
    } catch (err) {
      console.error(err)
      setMessage("QR expired or invalid")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Scanner
        onScan={(result) => {
          if (result?.[0]?.rawValue) approveQr(result[0].rawValue)
        }}
        onError={(error) => console.error(error)}
        constraints={{ facingMode: "environment" }}
        styles={{ container: { width: "300px" } }}
      />
      <p>{message}</p>
    </div>
  )
}
