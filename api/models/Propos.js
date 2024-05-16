import mongoose from "mongoose";

const ProposSchema = new mongoose.Schema({
   author: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
   tenderId: {
      type: String,
      required: true
   },
   approved: {
      type: Boolean,
      default: false
   }
}, { timestamps: true })

export default mongoose.model('Propos', ProposSchema)