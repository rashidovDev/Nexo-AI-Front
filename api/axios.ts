import { toast } from "@/hooks/use-toast";
import { generateToken } from "@/lib/generate-token";
import { IError } from "@/types";
import axios from "axios";
import { url } from "inspector";
import { useSession } from "next-auth/react";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL 


export const apiClient = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});


export const DELETE = async (url: string, id : string, token : string) => {
  try {
 const { data } = await apiClient.delete(`${url}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
})
if(data){ 
  toast({ description: data.message });
}
  }catch (error: any) {
			if ((error as IError).response?.data?.message) {
				return toast({ description: (error as IError).response.data.message, variant: 'destructive' })
			}
			return toast({ description: 'Something went wrong', variant: 'destructive' })
		}
}