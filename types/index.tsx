import { UserStatus, UserType } from "@/lib/enums/user.enum";
import { ObjectId } from "mongoose";

export interface ChildrenProps {
    children: React.ReactNode;
}

export interface IUser {
         _id: ObjectId;
        userType: UserType; // Optional
        userStatus: UserStatus; // Optional
        email: string; // Required
        username : string; // Required
        isVerified: boolean;
        bio: string;
        notificationSound: string;
        sendingSound: string;
        contacts: ObjectId[];
        userImage?: {
            url : string,
            public_id : string
        }; // Optional
        lastSeen?: Date; // Optional
        createdAt: Date; // Optional
        updatedAt: Date; // Optional (corrected from 'updete')
    }

export interface ChatsProps {
    _id: string;
    name: string;
    email: string;
}

export interface IError {
    response : {data : {message : string}}
}

