export interface IUser {
    _id: string;
    name: string;
    email: string;
    firstName? : string;
    lastName? : string;
    bio? : string;
    avatar?: string;
}

export interface ChatsProps {
    _id: string;
    name: string;
    email: string;
}