const Course=require("../models/Course");
const Tag=require("../models/Tags");
const User=require("../models/User");
const Category = require("../models/Category");
const {uploadImageToCloudinary}=require("../utils/imageUploader");


//create course handler function
exports.createCourse=async(req,res)=>{
    try{
        //fetch data ->req ki body
        const {courseName,courseDescription,whatUWillLearn,price,category,tag}=req.body;

        //get thumbnail ,fetch file ->req.files
        const thumbnail=req.files.thumbnailImage;

        //validation

        if(!courseName || !courseDescription || !whatUWillLearn || !price  ||!thumbnail || !category )
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        //check for instructor
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId,{ accountType: "Instructor" });
        console.log("Instructor Details:",instructorDetails);
        //todo verify userId


        if(!instructorDetails)
        {
             return res.status(400).json({
                success:false,
                message:"Instructor  Details not found",
            })
        }

        // check tag is valid or not
        // const tagDetails=await Tag.findById(tag);
        // if(!tagDetails)
        // {
        //     return res.status(404).json({
        //         success:false,
        //         message:"Tag Details not found",
        //     })
        // }
 
        //check category is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found",
            });
        }

        //Upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entery for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,instructor:instructorDetails._id,whatUWillLearn,
            price,
            // tag:tagDetails._id,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url}); 

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            instructorDetails._id, 
            { $push: { courses: newCourse._id } }, 
            { new: true }
        );

        //update Category schema -TODO
        await Category.findByIdAndUpdate(
            categoryDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        //return res
        return res.status(200).json({
                success:true,
                message:"Course created successfully",
                data:newCourse,
            })

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
        })
    }
}

//get all courses->handler function
exports.showAllCourses=async(req,res)=>{
    try{
        const allCourses=await Course.find({},
            {courseName:true,
            price:true,
            thumbnail:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
            }
        ).populate("instructor").exec();

        return res.status(200).json({
                success:true,
                message:"Data for all courses fethed successfully",
                data:allCourses, 
            })

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            err:err.message,
        })
    }
}

//getCourseDetails
exports.getCourseDetails=async(req,res)=>{
    try{
        //fetch course id
        const {courseId}=req.body;

        //find course details

        const courseDetails = await Course.findById(courseId) // Use findById for a single document
            .populate({
                path: "instructor", // Corrected typo
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            // .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();


        //validation
        if(!courseDetails)
        {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        //return response
         return res.status(200).json({
                success:true,
                message:"Course details fetched successfully",
                data:courseDetails,
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