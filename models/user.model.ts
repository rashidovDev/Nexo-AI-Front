import { Schema, models, model } from 'mongoose'
import { UserStatus, UserType } from "../lib/enums/user.enum";
import { IUser } from "@/types";
// Schema first and Code first

const userSchema = new Schema({
    userType: {
        type: String,
        enum: UserType,
        default:UserType.USER
    },
    isVerified: { type: Boolean, default: false },
    userStatus: {
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE
    },
    email: { type: String, required: true, unique: true },
    username: {
        type: String,
        index: { unique: true, sparse: true},
    },
    userPassword:{
        type:String, 
        select: false, 
    },
   userImage: {
    url: String,
    public_id: String
  },
    bio: { type: String, default: "" },
    notificationSound : {type : String, default: 'notification.mp3'},
    sendingSound : {type : String, default: 'sending.mp3'},
    lastSeen: { type: Date },
    contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
   { timestamps:true}  // updateAt createAt
);

const User = models.User || model<IUser>('User', userSchema)
export default User





