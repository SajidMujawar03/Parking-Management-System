import mongoose from "mongoose";



const slotSchema=new mongoose.Schema({
        photo:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        hourly_price:{
            type:String,
            required:true
        },
        longitude:{
                type:String,
                required:true
            },
        latitude:
            {
                type:String,
                required:true
            }
        ,
       
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
        }],
        expiry_date: { type: Date}, // Expiry date
    
},
    {
        timestamps:true
    }
);


const Slot=mongoose.model("Slot",slotSchema);
export default Slot;