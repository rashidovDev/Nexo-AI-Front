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
  username: z.string().min(2, "Name must be at least 2 characters").max(30,"Name must be at most 50 characters").optional(),
}).merge(emailSchema)

export const messageSchema = z.object({
  text: z.string().min(1, "Message can not be empty"),
  image : z.string().optional()
})

export const profileSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().optional(),
  username : z.string().max(20, "Username must be at most 20 characters"),
	bio: z.string().optional(),
})
  
export const confirmTextSchema = z.object({ confirmText: z.string() }).refine(data => data.confirmText === 'DELETE', {
	message: 'You must type DELETE to confirm.',
	path: ['confirmText'],
})

export const groupSchema = z.object({
  name: z.string().min(3),
  participantIds: z
    .array(
      z
        .string()
    )
    .min(1, "At least 1 participant is required"),
})