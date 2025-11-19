import { IMessage, IUser } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ObjectId } from "mongoose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSoundLabel = (value?: string) => {
	switch (value) {
		case 'notification.mp3':
			return 'Apple'
		case 'notification2.mp3':
			return 'Sammish'
		case 'sending.mp3':
			return 'Belli'
		case 'sending2.mp3':
			return 'Oranger'
		default:
			return ''
	}
}

export const sliceText = (text: string, length: number) => {
	return text.length > length ? `${text.slice(0, length)}...` : text
}




import { CONST } from './constants';

export const countUnread = (
  allMessages: IMessage[],
  chatId: string,
  currentUserId: string | ObjectId
): number => {
  const unread = allMessages.filter(msg => {
    // Normalize receivers to string array
    const receivers = Array.isArray(msg.receiver)
      ? msg.receiver.map(r => (typeof r === 'string' ? r : (r as IUser)._id))
      : [typeof msg.receiver === 'string' ? msg.receiver : (msg.receiver as IUser)._id];

    return (
    //   receivers.includes(currentUserId) &&
      msg.status !== CONST.READ &&
      msg.chat?.toString() === chatId.toString()
    );
  }).length;

  return unread;
};


