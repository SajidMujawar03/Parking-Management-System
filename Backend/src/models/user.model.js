import mongoose from "mongoose"
import Booking from "./booking.model.js"
import Review from "./review.model.js"
import Rating from "./rating.model.js"

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


userSchema.pre(/findOneAndDelete/, async function(next) {
    try {
        // console.log(`Preparing to delete user: ${this._id}`);

        const id = this._id; // Use this to access the current document's ID
        // console.log(`Deleting bookings for user: ${id}`);
        await Booking.deleteMany({ user: id });
        // console.log(`Deleting reviews for user: ${id}`);
        await Review.deleteMany({ user: id });
        // console.log(`Deleting ratings for user: ${id}`);
        await Rating.deleteMany({ user: id });

        next();
    } catch (error) {
        // console.error("Error in pre-findOneAndDelete hook:", error.message);
        next(error);
    }
});

const User=mongoose.model("User",userSchema);
export default User