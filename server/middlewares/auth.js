const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");


//auth
exports.auth=async(req,res,next)=>{
    try{
        //extract token
        let token=req.cookies.token||req.body.token||(req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

        //if token is missing,return
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }

        //verify the token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(err)
        { 
            //agar verify karne me issue aata hai hai toh
            return res.status(403).json({
                success:false,
                message:"Token is invalid",
            })
        }
        next();

    }
    catch(err){
         return res.status(401).json({
                success:false,
                message:"Something went wrong while validating the token",
            })
    }
}

//is student

exports.isStudent=async(req,res,next)=>{

    try{
        
        if(req.user.accountType!=="Student")
        {
            return res.status(403).json({
                success:false,
                message:"This is protected route for students only",
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again",
            })
    }
}

//instructor

exports.isInstructor=async(req,res,next)=>{

    try{
        
        if(req.user.accountType!=="Instructor")
        {
            return res.status(403).json({
                success:false,
                message:"This is protected route for instructor only",
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again",
            })
    }
}

//Admin

exports.isAdmin=async(req,res,next)=>{

    try{
        
        if(req.user.accountType!=="Admin")
        {
            return res.status(403).json({
                success:false,
                message:"This is protected route for admin only",
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again",
            })
    }
}