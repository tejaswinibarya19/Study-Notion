const Profile=require("../models/Profile");
const User=require("../models/User");
const{uploadImageToCloudinary}=require("../utils/imageUploader");
require("dotenv").config();

exports.updateProfile=async(req,res)=>{
    try{
        //fetch data
        const{gender,dateOfBirth="",about="",contactNum}=req.body;
        //fetch user id
        const userId=req.user.id;
        //validate
        // if(!contactNum || !gender || !userId)
        // {
        //     return res.status(400).json({
        //     success:false,
        //     message:"All fields are required",
        // })
        // }
        //find profile->jo pehle se bani hui hai
        const userDetails=await User.findById(userId);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.contactNum=contactNum;
        profileDetails.gender=gender;
        //update in db
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update profile",
        })
    }
}

//delete account

exports.deleteAccount=async(req,res)=>{
    try{
        //todo->Find more job sechedule
        //fetch id
        const id=req.user.id;
        //validate
        const user=await User.findById({_id:id});
        if(!user)
        {
            return res.status(404).json({
            success:false,
            message:"User not found",
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails});

        //TODO->unenrolled user from all enrolled courses

        //delete user
        await User.findByIdAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete account",
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try{
        //fetch data
        const userid=req.user.id;
        //fetch user details
        const userDetails=await User.findById(userid).populate("additionalDetails").exec();
        
        //return response
        return res.status(200).json({
            success:true,
            message:"Fetched User Details successfully",
            data:userDetails,
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Unable to get all details of user",
        })
    }
}


//update display picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        // Fetch the new picture from request files
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        // Upload image to Cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000, // Quality compression
            1000
        );
        console.log("Cloudinary Image Upload Response:", image);

        // Update the user's profile picture in the database
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { image: image.secure_url },
            { new: true }
        );

        // Return a success response
        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Error updating display picture: ${error.message}`,
        });
    }
};


//get enrolled courses

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and populate the courses field
        const userDetails = await User.findOne({
            _id: userId,
        })
        .populate("courses") // Populate the courses array with course documents
        .exec();

        // Validate if user exists
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }

        // Return the enrolled courses
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


