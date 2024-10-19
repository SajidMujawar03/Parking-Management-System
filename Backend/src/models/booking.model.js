import mongoose from "mongoose";
import { User } from "./user.model";
import slotModel from "./slot.model";

const BookingSchema=mongoose.Schema({
    start:{
        type:Date,
        required:true
    },
    end:{
        type:Date,
        required:true
    },
    hours:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    slot:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Slot",
        required:true
    }

})