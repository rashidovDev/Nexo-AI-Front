import { z } from "zod"
 
export const emailSchema = z.object({
  email: z.email("Invalid email address, please enter a valid email!"),
})

export const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
}).merge(emailSchema)

  