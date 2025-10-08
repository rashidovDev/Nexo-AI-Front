import { z } from "zod"
 
export const emailSchema = z.object({
  email: z.email("Invalid email address, please enter a valid email!"),
})

export const oldEmailSchema = z.object({
  oldEmail: z.string().email("Invalid email address, please enter a valid email!"),
}).merge(emailSchema)

export const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
}).merge(emailSchema)

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(30,"Name must be at most 50 characters"),
}).merge(emailSchema)


export const messageSchema = z.object({
  message: z.string().min(1, "Message can not be empty"),
  image : z.string().optional()
})

export const profileSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().optional(),
	bio: z.string().optional(),
})
  
export const confirmTextSchema = z.object({ confirmText: z.string() }).refine(data => data.confirmText === 'DELETE', {
	message: 'You must type DELETE to confirm.',
	path: ['confirmText'],
})