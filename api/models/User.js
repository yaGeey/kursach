import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   email: {
      type: String,
      required: false,
      unique: true,
   },
   password: {
      type: String,
      required: true
   },
   avatar: {
      type: String,
      default: null
   },
   bio: {
      type: String,
      default: null
   },
   isAdmin: {
      type: Boolean,
      default: false
   }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)