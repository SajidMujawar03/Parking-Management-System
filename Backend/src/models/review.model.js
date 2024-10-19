import mongoose from "mongoose";


const reviewSchema=new mongoose.Schema(
{
    slot:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"Slot",
    },
    content:{
        type:String,
        required:true
    },
    rating
},
    {
        timestamps:true
    }
)