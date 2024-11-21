import Review from "../models/review.model.js";

export const postReview=async(req,res)=>{
    const {userId,name,email,rating,review}=req.body;

    try {
        const review=new Review(
           { user:userId,
            name,
            email,
            rating,
            comment:review
           }

        )
        await review.save()

        res.status(200).json({success:true,message:"review Saved Successfully"});


    } catch (error) {
        
    }
}