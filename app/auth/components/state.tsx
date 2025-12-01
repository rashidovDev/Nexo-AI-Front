"use client"

import { Button } from "@/components/ui/button"
import QrLoginBox from "./qrlogin"
import Signin from "./signin"
import Verify from "./verification"
import { useAuthStore } from "@/services/use-auth"
import Social from "./social"

const StateAuth = () => {
  const {step, setStep} = useAuthStore()
  return (
    <>
  
   {step === 'login' ? (
  <Signin />
) : step === 'verify' ? (
  <Verify />
) : step === 'qr' ? (
  <QrLoginBox />
) : null}
{step === 'login' && <Social/>} 
  <div><Button onClick={() => {
    if(step == 'qr'){
      setStep('login')
    }else{
setStep('qr')
    }
  } }  className='bg-transparent hover:bg-primary transition-all text-sm text-primary mt-3 hover:text-white'>
        {step === 'qr' ? 'LOG IN BY CREDENTIALS' : 'LOG IN BY QR CODE'} 
       </Button></div>

            
    </>
  )
}

export default StateAuth