"use client"

import Signin from "./signin"
import Verify from "./verification"
import { useAuthStore } from "@/services/use-auth"

const StateAuth = () => {
  const {step} = useAuthStore()
  return (
    <>
    {step === 'login' ? <Signin /> : <Verify />}
    </>
  )
}

export default StateAuth