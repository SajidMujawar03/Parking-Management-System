import mongoose from "mongoose";

const ownerSchema=mongoose.Schema({
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

    
},{
    timestamps:true
})

export default Owner=mongoose.model("Owner",ownerSchema)