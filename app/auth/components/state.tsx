"use client"

import QrLoginBox from "./qrlogin"
import Signin from "./signin"
import Verify from "./verification"
import { useAuthStore } from "@/services/use-auth"
import Social from "./social"

const StateAuth = () => {
  const { step } = useAuthStore()

  return (
    <div className="w-full flex flex-col md:flex-row md:items-start gap-10">
      <div className="flex-1 space-y-4">
        {step === "login" ? <Signin /> : <Verify />}
        {step === "login" && <Social />}
      </div>

      <div className="hidden md:flex w-full max-w-sm flex-col gap-4 rounded-2xl border bg-secondary/30 p-6 shadow-sm">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-semibold">Log in with your phone</h3>
          <p className="text-sm text-muted-foreground">
            Open the mobile app, go to Settings {" > "} Link Desktop Device, then scan the QR code.
          </p>
        </div>
        <QrLoginBox />
      </div>
    </div>
  )
}

export default StateAuth
