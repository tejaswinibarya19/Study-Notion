const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");

//create rating
exports.createRating=async(req,res)=>{
    try{
        //get user id
        const userId=req.user.id;
        //fetch data from body
        const {rating,review,courseId}=req.body;
        //check user enrolled or not
        const courseDetails=await Course.findOne(
            {_id:courseId,
            studentsEnrolled :{$elemMatch:{$eq:userId}},
        });
        if(!courseDetails)
        {
            return res.status(404).json({
                success:false,
                message:"student is not enrolled in the course"
            });
        }
        //check karo already review toh ni de rakha hai
        const alreadyReviewed=await RatingAndReview.findOne({user:userId,
            course:courseId,
        })
        
        if(alreadyReviewed)
        {
            return res.status(403).json({
                success:false,
                message:"Course is alreday reviewd by the user"
            });
        }

        //create rating and review 
        const ratingReview=await RatingAndReview.create({rating,review,course:courseId,user:userId,});
        //update course with rating and review
        const updatedCourseDetails= await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews:ratingReview._id,
                }
            },
            {new:true})
            console.log(updatedCourseDetails);
        //return response
         return res.status(200).json({
                success:true,
                message:"Rating and review created successfully",
                ratingReview,
            });

    }
    catch(err){
        console.log(err);
         return res.status(500).json({
                success:false,
                message:err.message,
            });
    }
}


//get average rating
exports.getAverageRating=async(req,res)=>{
    try{
        //get course id
        const courseId=req.body.courseId;
        //calculate avg rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
         //return rating
        if(result.length>0)
        {
            
            return res.status(200).json({
                    success:true,
                    averageRating:result[0].averageRating,
                });
        }
       
        //if no rating/review exist  
        return res.status(200).json({
                    success:true,
                    message:"Average rating is 0",
                    averageRating:0,
                });

    }
    catch(err)
    {
        console.log(err);
         return res.status(500).json({
                success:false,
                message:err.message,
            });
    }
}

//get all rating

exports.getAllRating=async(req,res)=>{
    try{

        const allReviews=await RatingAndReview.find({}).schemaLevelProjections({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courseName",
        })
        .exec();
        //return tresponse
    return res.status(200).json({
                    success:true,
                   message:"All reviews fetched successfully",
                });

    }
    catch(err)
    {
        return res.status(500).json({
                success:false,
                message:err.message,
                });
    }
}