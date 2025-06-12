import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User : /api/user/register
export const register = async (req, res) =>{
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({success: false, message: 'Please enter all fields'});
        }

        const exisitingUser = await User.findOne({email})
        if (exisitingUser) {
            return res.json({success: false, message: 'User already exists'});
        }

        const hashPassword = await bcrypt.hash(password,10)

        const user = await User.create({name,email,password: hashPassword})

        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent js to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',  // secure from CSRF production
            maxAge: 7 * 24 * 60 * 60 * 1000 //Cookie expiration time
        })
        return res.json({success: true, user: {email: user.email, name: user.name},
            message:"Register Successfull"});
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}


//Login user : /api/user/login
export const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({success: false, message: 'Please enter all fields'});
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.json({success: false, message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid password'});
        }
        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent js to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',  // secure from CSRF production
            maxAge: 7 * 24 * 60 * 60 * 1000 //Cookie expiration time
        })
        return res.json({
            success: true,
            user: {
                email: user.email,
                name: user.name,
                cardItems: user.cardItems || {}, // make sure it's always an object
                _id: user._id, // also useful for frontend
            },
            message:"Login Successfull"
        });

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}


//Check Auth  /api/user/auth

export const isAuth = async (req, res) =>{
    try {
        const userId = req.userId; // ✅ this comes from the auth middleware
        const user = await User.findById(userId).select("-password");

        return res.json({success: true, user})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}

//Logout user /api/user/logout
export const logout = async (req, res) =>{
    try {
        res.clearCookie('token', {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        });
        return res.json({success: true, message: 'Logged out successfully'});
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}