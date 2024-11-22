import mongoose from "mongoose";
import Slot from "../models/slot.model.js"


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
    ],
    bankAccount:{
        type:String,
        default:null
    },
    ifscCode:
    {
        type:String,
        default:null
    }


    
},{
    timestamps:true
})



ownerSchema.pre("remove",async function (){
    try {
        const id=this._id;
       Slot.deleteMany({owner:id})
        next();
    } catch (error) {
        next(error)
    }
})

const Owner=mongoose.model("Owner",ownerSchema);
export default Owner;