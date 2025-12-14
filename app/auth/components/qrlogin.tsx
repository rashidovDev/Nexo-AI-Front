"use client"

import React, { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { signIn } from "next-auth/react"
import { apiClient } from "@/api/axios"
import { Oval } from 'react-loader-spinner'


type Status = "pending" | "approved" | "expired" | "error" | "loading"

const QrLoginBox = () => {
  const [qrId, setQrId] = useState<string>("")
  const [status, setStatus] = useState<Status>("loading")
  const [error, setError] = useState<string | null>(null)

  const createQr = async () => {
    try {
      setStatus("loading")
      setError(null)

      const { data } = await apiClient.post<{ qrId: string }>("/qr/create")
      setQrId(data.qrId)
      setStatus("pending")
    } catch (err) {
      console.error(err)
      setError("Failed to create QR")
      setStatus("error")
    }
  }

  // create QR on mount
  useEffect(() => {
    createQr()
  }, [])

  // poll status
  useEffect(() => {
    if (!qrId || status !== "pending") return

    let active = true

    const interval = setInterval(async () => {
      if (!active) return

      try {
        const { data } = await apiClient.get<{
          status: "PENDING" | "APPROVED"
          userId?: string
        }>("/qr/status", {
          params: { qrId }
        })

        if (!active) return

        if (data.status === "APPROVED") {
          setStatus("approved")
          clearInterval(interval)

          await signIn("credentials", {
            qrUserId: data.userId,
            redirect: true,
            callbackUrl: "/",
          })
        }
      } catch (err) {
        console.error(err)

        if (!active) return

        const statusCode = (err as { response?: { status?: number } }).response?.status
        if (statusCode === 404) {
          setStatus("expired")
        } else {
          setStatus("error")
        }

        clearInterval(interval)
      }
    }, 2000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [qrId, status])

  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL}/qr/scan?qrId=${qrId}`

  return (
    <div className="flex flex-col items-center gap-3 mt-4">

      {status === "loading" && <div><Oval
      height={60}
      width={60}
      color="#5900D0"
      // ariaLabel="audio-loading"
      wrapperStyle={{}}
      wrapperClass=""
    /></div>}

      {status === "pending" && qrId && (
        <>
          {/* <h3 className="text-2xl font-semibold">Log in to Nexo AI by QR Code</h3> */}
          <QRCode value={qrUrl} size={180} />

          <div>
            <div className="flex items-center  py-2">
              <div className="w-5 h-5 bg-primary 
              rounded-full text-white flex justify-center items-center text-xs">1</div>
              <div className="ml-3 text-xl text-start">Open Nexo AI on your phone</div>
            </div>

             <div className="flex items-center  py-2">
              <div className="w-5 h-5 bg-primary 
              rounded-full text-white flex justify-center items-center text-xs">2</div>
              <div className="ml-3 text-xl">Go to Settings {`${'>'}`} Link Desktop Device</div>
            </div>

             <div className="flex items-center py-2">
              <div className="w-5 h-5 bg-primary 
              rounded-full text-white flex justify-center items-center text-xs">1</div>
              <div className="ml-3 text-xl">Scan the QR Code</div>
            </div>
          </div>
        </>
      )}

      {status === "approved" && (
        <p className="text-xs text-green-600">Approved… logging in</p>
      )}

      {status === "expired" && (
        <>
          <p className="text-xs">QR expired</p>
          <button
            onClick={createQr}
            className="underline text-sm text-blue-600 hover:text-blue-800"
          >
            Generate new
          </button>
        </>
      )}

      {status === "error" && (
        <p className="text-red-500 text-xs">{error || "Unexpected error"}</p>
      )}
    </div>
  )
}

export default QrLoginBox
