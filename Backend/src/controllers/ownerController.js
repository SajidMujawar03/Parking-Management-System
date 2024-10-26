import Owner from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const updateProfile=async (req,res)=>{
    const id=req.params.id
    try {

        
        if(req.body.password)
        {
           
            const salt=await bcrypt.genSalt(10);
           
            const hashPassword=await bcrypt.hash(req.body.password,salt);
         
            req.body.password=hashPassword;
        }
      

        
        const user=await Owner.findByIdAndUpdate(id,{$set:req.body},{new:true}).select("-password").select("-slots");

        res.status(200).json({success:true,message:"Updating Profile...",data:user})


    } catch (error) {
        res.status(500).json({success:false,message:"Something went wrong..."})
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Owner.findOneAndDelete(id);
        
        // if (!user) {
        //     console.log("Owner not found.");
        //     return res.status(404).json({ message: "Owner not found" });
        // }
    
       
        
        res.status(200).json({ message: "Owner profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting user profile:", error.message);
        res.status(500).json({ message: "Error deleting user profile", error: error.message });
    }
};

export const getAllOwners=async(req,res)=>{
            console.log("hi")
    
        try {
            console.log("hi");
            const users=await Owner.find({}).select("-password -slots");
            
            res.status(200).json({success:true,message:"Owner Data sending....",data:users})
            
        } catch (error) {
            res.status(500).json({success:false,message:"Internal server error"})
        }
}


export const getSlots=async(req,res)=>{
    try {
        const id=req.params.id;
        // console.log(id)
        const user=await Owner.findById(id).populate('slots');
        if(!user)
            res.status(404).json({success:false,message:"user not found"})
        
        const slots=user.slots;

        res.status(200).json({success:true,message:"slots found",data:slots})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
    }
}


export const getOwner=async(req,res)=>{
    try {
        const user=await Owner.findById(req.params.id).select("-password -slots")
        res.status(400).json({data:user})
    } catch (error) {
        
    }
}






export const getProfile=async (req,res)=>{
    const id=req.userId;
    try {
        const user=await Owner.findById(id);

        if(!user)
        {
            return res.status(404).json({success:false,message:"Owner Not Found..."});
        }
        const {password,slots,...rest}=user._doc;

        res.status(200).json({success:true,message:"Owner data is getting...",data:{...rest}})


    } catch (error) {
        res.status(500).json({success:true,message:"Something went wrong..."})
    }
}
