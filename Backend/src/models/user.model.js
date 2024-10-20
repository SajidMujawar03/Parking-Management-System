import mongoose from "mongoose"



const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    role:{
        type:String,
        required:true
    },
    photo:{
        type:String
    },
    slots:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Slot"
        }
    ]
},{timestamps:true})



export const User=mongoose.model("User",userSchema);