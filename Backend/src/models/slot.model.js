import mongoose from "mongoose";



const slotSchema=new mongoose.Schema({
        photo:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        hourly_price:{
            type:String,
            required:true
        },
       
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Owner",
            required:true
        },
        status: {
            type: String,
            enum: ['available', 'booked'],
            default: 'available'
        },
        added_on: {
            type: Date,
            default: Date.now
        },
        review:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }]
    
},
    {
        timestamps:true
    }
)


export default Slot=mongoose.model("Slot",slotSchema);