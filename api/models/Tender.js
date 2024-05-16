import mongoose from "mongoose";

const TenderSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   owner: {
      type: String,
      required: true,
   },
   charterer: {
      type: String,
      required: true,
   },
   dateEnd: {
      type: Date,
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
   logo: {
      type: String,
   },
   propositions: {
      type: [String],
   },
   stopped: {
      type: Boolean,
      default: false
   },
   approvedProp: {
      type: String,
      default: null
   }
}, { timestamps: true })
.index({ 
   'title':'text',
   'desc':'text',
   'charterer':'text',
})

export default mongoose.model('Tender', TenderSchema)