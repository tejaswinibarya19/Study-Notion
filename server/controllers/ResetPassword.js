const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto=require("crypto");

//reset password (mail send to verify)
exports.resetPasswordToken=async(req,res)=>{
    try{
        //get email 
        const email=req.body.email;

        //check user for this email exists or not
        const user=User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist",
            })
        }

        //generate token
        const token=crypto.randomBytes(20).toString("hex");

        //update user by adding token and expiration time
        const updateedDetails=await User.findOneAndUpdate(
        {
            email:email
        },
        {
            token:token,
            resetPasswordExpires:Date.now()+3600000,
        },
        {
            new:true,
        })

        console.log("Details:",updateedDetails);
        //create url-front-end ka link create kreneg
        const url=`http://localhost:3000/update-password/${token}`

        //send mail containing url
        await mailSender(email,"Password Reset",`Your Link for email verificationis ${url}.Please click this url to reset your password.`)

        //return res
        return res.status(400).json({
                success:true,
                message:"Email sent successfully,please change password",
            })
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
                success:false,
                message:"Something went wrong while reset password",
            })
    }
}



//reset password (db me se) 

exports.resetPassword=async(req,res)=>{
    try{

        //data fetch
        const {password,confirmPassword,token}=req.body;

        //validation

        if(password!==confirmPassword)
        {
            return res.json({
                success:false,
                message:"Password not matching",
            })
        }

        //get user details from db using token

        const userDetails=await User.findOne({token:token});


        //if there is no entry ->Invalid token/Token expires

        if(!userDetails)
        {
            return res.json({
                success:false,
                message:"Token is invalid",
            })
        }
        if(!(userDetails.resetPasswordExpires>Date.now() ))
        {
            return res.status(403).json({
                success:false,
                message:"Token is expired.",
            })
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);


        //update password

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true});

        //return response
        return res.status(200).json({
                success:true,
                message:"Password reset successfully",
            })
    }
    catch(err)
    {
        return res.status(500).json({
                success:false,
                message:"Unable to reset",
            })
    }
} 