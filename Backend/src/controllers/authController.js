import Owner from "../models/owner.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken=(user)=>{
    return jwt.sign( { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15d' });
}

export const register=async(req,res)=>{
    const {eamil,name,password,photo,phone,role}=req.body;

    try {
        
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error.."})
    }
}

export const login=async(req,res)=>{
    const {email,password:Password,role}=req.body;

    try {
        let user;
        if(role==='user')
        {
             user=await User.findOne({email:email});
        }
        else if(role==='owner')
        {
             user=await Owner.findOne({email:email});
        }
        else
        {
            res.status(404).json({success:false,message:"Invalid role"})
        }

        const isMatched=await bcrypt.compare(Password,user.password);

        if(!isMatched)
        {
            res.status(400).json({success:false,message:"Password did not matched"})
        }

        const token=generateToken(user)

        const {password,slots,...rest}=user;

        res.status(200).json({success:false,message:"Successfully logged in",data:{...rest,token}})
        
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"});
    }
}



