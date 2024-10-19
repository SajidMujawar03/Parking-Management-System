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
        price:{
            type:String,
            required:true
        },
       
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Owner",
            required:true
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