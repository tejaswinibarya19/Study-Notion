const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    },
    
    otp:{
            type:String,
            required:true,
        }
    
})

//function to send email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email sent successFully",mailResponse);
    }
    catch(err){
        console.log("Error occured while sending email",err);
    }
}

OtpSchema.pre('save',async function (next) {
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.exports=mongoose.model("OTP",OtpSchema);