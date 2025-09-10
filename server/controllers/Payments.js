const mongoose=require("mongoose");
const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");

const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");

const crypto =require("crypto");
require("dotenv").config();

//capture the payment and the razorpay order
exports.capturePayment=async(req,res)=>{
    try{
        //fetch course id and user id
        const {course_id}=req.body;
        const userId=req.user.id;

        //validation
        if(!course_id)
        {
            return res.json({
                success:false,
                message:"Provide valid course id",
            })
        }

        let course;
        try
        {
            course = await Course.findById(course_id);
            if(!course)
            {
                return res.json({
                success:false,
                message:"Course not found",
                })
            }

            const uid=new mongoose.Types.ObjectId(userId);
            //check kiya pehle se enrolled toh nahi hai
            if(course.studentsEnrolled.includes(uid))
            {
                return res.status(400).json({
                success:false,
                message:"Student is already enrolled",
                })
            }
        }
        catch(err)
        {
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message,
                })
        }
        //create order
        const amount=course.price;
        const currency="INR";
        const options={
            amount:amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId,
            }
        };

        try{
            //initiate the payment using razorpay
            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
                });
        }
        catch(err){
            console.log(err);
            return res.json({
                success:false,
                message:"could not initiate ordser",
                })
        }
       
    }
    catch(err){
        console.error(err); 
        return res.status(500).json(
        {
            success: false, 
            message: "An unexpected error occurred." 
        });
    }
};



//verify signature
exports.verifySignature=async(req,res)=>{
    try{
        const webhookSecret=process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature=req.headers["x-razorpay-signature"]; //yahi se hi milta hai .why nahi.yahi hi rehta hai

        //Hmac->Hashed based message authentication code
        const shasum=crypto.createHmac("sha256",webhookSecret);

        shasum.update(JSON.stringify(req.body));
        const digest=shasum.digest("hex"); 

        if(signature===digest)
        {
            console.log("Payment is authorised");
            const {courseId,userId}=req.body.payload.payment.entity.notes;

            try{
                //fulfill the action

                //find the course and enroll the student in it
                const enrolledCourse=await Course.findOneAndUpdate(
                    {_id:courseId},
                    {$push:{studentsEnrolled:userId}},
                    {new:true},
                );
                if(!enrolledCourse)
                {
                    return res.status(500).json({
                    success:false,
                    message:"Course not found",
                    })
                }

                console.log(enrolledCourse);

                //find the student and add course to list of enrolled course
                const enrolledStudent=await User.findOneAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true},);

                console.log(enrolledStudent);

                //confirmation mail sned

                const emailResponse=await mailSender(
                    enrolledStudent.email,
                    "Congratulations, from Studynotion",
                    "congratulations, you are onboarded into new studynotion course",
                );
                console.log(emailResponse);
                return res.status(200).json({
                success:true,
                message:"Signature verified and course added",
                })
            }
            catch(err){
                return res.status(500).json({
                success:false,
                message:err.message,
                })
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:err.message,
                })
        }
        
    }
    catch(err){
        return res.status(400).json({
                success:false,
                message:err.message,
                })
    }
}