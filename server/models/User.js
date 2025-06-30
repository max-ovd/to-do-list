import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        email: String,
        password: String
    }, { versionKey: false }
)

const User = mongoose.model("User", UserSchema)
export default User;