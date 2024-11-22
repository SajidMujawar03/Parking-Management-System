//only getMyProfile remaining

import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const updateProfile = async (req, res) => {
    const id = req.params.id;
    try {
        // Find user by ID
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Handle password update logic
        if (req.body.password) {
            if (!req.body.oldPassword) {
                return res.status(400).json({ success: false, message: "Old password is required" });
            }

            const isMatched = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!isMatched) {
                return res.status(400).json({ success: false, message: "Old password did not match" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashPassword;
        } else {
            // If password isn't being updated, ensure it isn't overwritten
            delete req.body.password;
        }

        // Remove oldPassword from the request body after processing
        delete req.body.oldPassword;

        // Update user profile, excluding password and slots
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
                                      .select("-password")
                                      .select("-slots");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log(error);  // Log the complete error for debugging
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const id = req.user.id;
        // console.log(id)
        const user = await await User.findByIdAndDelete(id);
        
        // if (!user) {
        //     console.log("User not found.");
        //     return res.status(404).json({ message: "User not found" });
        // }
    
       
        
        res.status(200).json({ success:true,message: "User profile deleted successfully" });
    } catch (error) {
        // console.error("Error deleting user profile:", error.message);
        res.status(500).json({success:false, message: "Error deleting user profile", error: error.message });
    }
};

export const getAllUsers=async(req,res)=>{
            // console.log("hi")
    
        try {
            // console.log("hi");
            const users=await User.find({}).select("-password -slots");
            
            res.status(200).json({success:true,message:"User Data sending....",data:users})
            
        } catch (error) {
            res.status(500).json({success:false,message:"Internal server error"})
        }
}


export const getSlots=async(req,res)=>{
    try {
        const id=req.user.id;
        // console.log(id)
        const user=await User.findById(id).populate('slots');
        if(!user)
            res.status(404).json({success:false,message:"user not found"})
        
        const slots=user.slots;

        res.status(200).json({success:true,message:"slots found",data:slots})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
    }
}


export const getUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id).select("-password -slots")
        res.status(400).json({data:user})
    } catch (error) {
        
    }
}






export const getProfile=async (req,res)=>{
    const id=req.user.id;
    try {
      
        const user=await User.findById(id);
        
        if(!user)
        {
            return res.status(404).json({success:false,message:"User Not Found..."});
        }
        const {password,slots,...rest}=user._doc;

        res.status(200).json({success:true,message:"User data is getting...",data:{...rest}})


    } catch (error) {
        res.status(500).json({success:true,message:"Something went wrong..."})
    }
}
