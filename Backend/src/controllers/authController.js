//completed

import Owner from "../models/owner.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });
}

export const register = async (req, res) => {
    const { email, name, password, photo, phone, role } = req.body;

    try {
        
        const lowerCaseEmail = email.toLowerCase();
        let user = null;
       
       
        if (role === "user") {
            user = await User.findOne({ email: lowerCaseEmail });
        } else if (role === "owner") {
            user = await Owner.findOne({ email: lowerCaseEmail });
        }
        else
        {
            return res.status(200).json({ success: false, message: "Invalid role" });
        }

        // console.log(user);


        if (user!=null) {
            return res.status(409).json({ success: false, message: "User Already Exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        
        if (role === "user") {
            user=new User({ email: lowerCaseEmail, name, password: hashPassword, photo, phone, role }) 
        } else if (role === "owner") {
            user = new Owner({ email: lowerCaseEmail, name, password: hashPassword, photo, phone, role })
        }

        await user.save();

        res.status(200).json({ success: true, message: "Registration successful" });

    } catch (error) {
        // console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const login = async (req, res) => {
    const { email, password: Password, role } = req.body;

    try {
        let user = null;

        if (role === 'user') {
            user = await User.findOne({ email: email.toLowerCase() });
        } else if (role === 'owner') {
            user = await Owner.findOne({ email: email.toLowerCase() });
        } else {
            return res.status(404).json({ success: false, message: "Invalid role" });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatched = await bcrypt.compare(Password, user.password);

        if (!isMatched) {
            return res.status(400).json({ success: false, message: "Password did not match" });
        }

        const token = generateToken(user);
        const { password, slots, ...rest } = user.toObject(); // Convert Mongoose Document to Object
        res.status(200).json({ success: true, message: "Successfully logged in", data: { ...rest }, token });

    } catch (error) {
        // console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}
