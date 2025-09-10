
const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const Profile=require("../models/Profile");
const bcrypt=require("bcrypt"); 
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const{passwordUpdate}=require("../mail/templates/passwordUpdate");
require("dotenv").config();

//send otp

exports.sendOTP=async (req,res)=>{
    try{
        //fetch email from req ki body
        const{email}=req.body;

        //check if user already exists
        const checkUserPresent=await User.findOne({email});

        //agra already exists kart hai toh
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already exist",
            })
        }

        //generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("Otp generated:",otp);

        //check unique otp or nor
        let result=await OTP.findOne({otp:otp});
        //jab tak otp db me jo hai usse match ho raha hai tab tak dusra otp generate kareneg 
        while(result)
        {
            otp=otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result=await OTP.findOne({otp:otp});
        }

        const payload={email,otp};
        //crate enetry in db for OTP
        const otpBody=await OTP.create(payload);
        console.log(otpBody);

        return res.status(200).json({
            success:true,
            message:"OTp sent successfully",
            otp,
        })


    }
    
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    } 
}

//signup

exports.signup=async(req,res)=>{

    try{
        //data fetch from req ki body
        const{firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;

        //validate karo

        if(!firstName || !lastName || !email || !password || !confirmPassword ||!otp)
        {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //dono password match karo 

        if(password!==confirmPassword)
        {
            return res.status(400).json({
                    success:false,
                    message:"Password does't match,plaese try again",
                })   
        }
        //check user already exist or not

        const existingUser=await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                    success:false,
                    message:"User is already registered",
                })   
        }


        //find most recent OTP stored for the user

        const response=await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);


        //validate OTP

        if(response.length === 0)
        {
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP not found",
            })
        }

        else if(otp!==response[0].otp)
        {
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"OTP Invalid",
            })
        }


        //hash password

        const hashedPassword=await bcrypt.hash(password,10);

        //enetry create in db
        let approved="";
        approved==="Instructor" ? (approved=false) : (approved =true);
        //create additional profile for user
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNum:contactNumber,
        });
        const user=await User.create({
            firstName,lastName,email,password:hashedPassword,accountType:accountType,contactNumber:approved,additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })
        return res.status(200).json({
                success:true,
                message:"User is registered successfully",
                user,
            })

    }
    catch(err)
    {
        return res.status(500).json({
                success:false,
                message:"User can't be registered,please try again",
            })
    }
    
}

//login 

exports.login=async(req,res)=>{
    try{

        //fetch data
        const {email,password}=req.body;
        
        //validation

        if(!email || !password)
        {
            //return 400 Bad request status code with error message
            return res.status(400).json({
                success:false,
                message:"All fields are required ,plaese try again"
            });
        }

        //check user exists or not

        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user)
        {
            //Return 401 unauthorized status code 
            return res.status(401).json({
                success:false,
                message:"User is not registered,plaese signup "
            })
        }

        //generate jwt token,after password matching
        if(await bcrypt.compare(password,user.password))
        {
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h',
            })
            user.token=token;
            user.password=undefined;

            //create cookie


            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }


            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"Logged in successfully",
                user,
                token,
            })
        }
        else{
             return res.status(401).json({
                success:false,
                message:"Password is incorrect "
            })
        }

        

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Login failure,try again"
            })
    }
}

//change password

exports.changePassword=async(req,res)=>{
    try{
        //fetch data
        const email = req.body.email;
        const user = await User.findOne({ email: email }); 
        //validation
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        const token = crypto.randomBytes(20).toString("hex");
        
        //update password in db
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000, // 1 hour
            },
            { new: true }
        );
        console.log("Details:", updatedDetails);

        const url = `http://localhost:3000/update-password/${token}`;

        //send mail->password updated
        await mailSender(email, "Password Reset", `Your Link for email verification is ${url}. Please click this url to reset your password.`);

        //return response
        return res.status(200).json({ 
            success: true,
            message: "Email sent successfully, please check your email to change password",
        });
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
       
}
