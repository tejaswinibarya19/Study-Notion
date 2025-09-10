const Subsection=require("../models/Subsection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
//create subsection
exports.createSubSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionId,title,timeDuration,description}=req.body;
        //extract file/video
        const video=req.files.videoFile;
        //validation
        if(!sectionId||!title|| !description || !video || !timeDuration)
        {
            return res.status(400).json({
            success:false,
            message:"All fields are required",
        })
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const subSectionDetails=await Subsection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with this subsection objectid
        const updatedSection=await Section.findByIdAndUpdate(
            sectionId,
            {$push:{subSection:subSectionDetails._id}},
            {new:true},
        ).populate("subSection").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"Successfully created sub section",
            data: updatedSection,
        })
    }
    catch(err)
    {
        console.error("SUBSECTION CREATION ERROR:", err);
        return res.status(500).json({
            success:false,
            message:"Unable to create sub section",
        })
    }
}

//update subsection
exports.updateSubSection=async(req,res)=>{
    try{

        const{ sectionId,title,description}=req.body;
        const subSection=await Subsection.findById(sectionId);
        if(!subSection)
        {
            return res.status(404).json({
                success:false,
                mesage:"Subsection not found",
            })
        }

        if(title!==undefined)
        {
            subSection.title=title
        }
        if(description!==undefined)
        {
            subSection.description=description
        }
        if(req.files && req.files.video !==undefined)
        {
            const video=req.files.video;
            const uploadDetails=await uploadImageToCloudinary(video,
                process.env.FOLDER_NAME,
            )
            subSection.videoUrl=uploadDetails.secure_url
            subSection.timeDuration=`${uploadDetails.duration}`
        }
        await subSection.save();
        return res.status(200).json({
                success:true,
                mesage:"Subsection updated successfully",
            })
    }
    catch(err)
    {
        return res.status(404).json({
                success:false,
                mesage:"Error occured",
            })
    }
}

//delete subsection

exports.deleteSubSection=async(req,res)=>{
    try{
        const {subSectionId,sectionId}=req.body;
        await Section.findByIdAndUpdate({
            _id:sectionId
        },
        {
            $pull:{
                subSection:subSectionId,
            }
        })
        const subSection=await Subsection.findByIdAndDelete({_id:subSectionId})

        if(!subSection)
        {
            return res.status(404).json({
                success:false,
                mesage:"Subsection not found",
            })
        }
        return res.status(200).json({
                success:true,
                mesage:"Subsection deleted successfully",
            })
    }
    catch(err){
        return res.status(500).json({
                success:false,
                mesage:"Error occured while deleting subsection",
            })
    }
}