import { UserStatus, UserType } from "@/lib/enums/user.enum";
import { ObjectId } from "mongoose";

export interface ChildrenProps {
    children: React.ReactNode;
}

export interface IUser {
         _id: ObjectId | string;
        userType?: UserType; // Optional
        userStatus?: UserStatus; // Optional
        email: string; // Required
        username? : string; // Required
        isVerified?: boolean;
        firstName?: string;
        lastName?: string;
        bio?: string;
        notificationSound?: string;
        sendingSound?: string;
        contacts?: ObjectId[];
        muted?: boolean;
        userImage?: {
            url : string,
            public_id : string
        }; // Optional
        lastSeen?: Date; // Optional
        // createdAt?: Date; // Optional
        // updatedAt: Date; // Optional (corrected from 'updete')
    }

export interface ChatsProps {
    _id: string;
    name: string;
    email: string;
}

export interface IError {
    response : {data : {message : string}}
}

export interface IContact {
_id : string;
firstName? : string;
lastName? : string;
email : string;
userImage?: {
            url : string,
            public_id : string
        };
   bio?: string;
}

export interface IMessage {
	_id: string
    chat: IChat | string | ObjectId 
	text: string
	image: string
	reactions: {
        _id?: string;
    reaction: string;                        // emoji or reaction type
    user: IUser;                            // userId (ObjectId as string)
  }[];
	  sender: IUser | string | ObjectId
  receiver: IUser | string | ObjectId
  readBy? : {
    at : Date
    user : ObjectId | string
    _id : ObjectId
  }[]
	createdAt: string
	updatedAt: string
	status: string
}
export interface IMsgChat {
	_id: string
    chat: IChat
	text: string
	image: string
	reactions: {
        _id?: string;
    reaction: string;                        // emoji or reaction type
    user: IUser;                            // userId (ObjectId as string)
  }[];
	  sender: IUser | string | ObjectId
  receiver: IUser | string | ObjectId
	createdAt: string
	updatedAt: string
	status: string
}

export interface IMessageChat {
	_id: string
    chat: IChat 
	text: string
// 	image: string
// 	reactions: {
//         _id?: string;
//     reaction: string;                        // emoji or reaction type
//     user: IUser;                            // userId (ObjectId as string)
//   }[];
	  sender: IUser | string | ObjectId
//   receiver: IUser | string | ObjectId
// 	createdAt: string
// 	updatedAt: string
// 	status: string
}


export interface IChat {
  _id: string;                // MongoDB document ID
  name?: string;              // for group chats
  isGroup?: boolean;
  participants: IUser[];     // user IDs
  admins: string[];           // subset of participants (for groups)
  lastMessage?: IMessage;       // message ID or populated message
}
// export interface IChat {
//   _id: string;   
//   name ? : string;              // chat ID
//   isGroup: boolean;            // false for 1-on-1 chat
//   participants: IUser[];       // array of users
//   admins: IUser[];             // array of admins (empty for 1-on-1)
//   __v: number;
//   lastMessage: string | IMessage; // ID of last message (or full message)
// }