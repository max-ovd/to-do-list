import mongoose from 'mongoose'
import { ListSchema } from './List.js'

const UserSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        lists: [ListSchema],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, { versionKey: false }
)

const User = mongoose.model("User", UserSchema)
export default User;