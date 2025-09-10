const Section=require("../models/Section");
const Course=require("../models/Course");
const Subsection =require("../models/Subsection");
exports.createSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName,courseId}=req.body;
        //validation
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:"Missing properties",
            })
        }
        //create section
        const newSection= await Section.create({sectionName});

        //update course with section objectId
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId,{
                $push:{
                    courseContent:newSection._id,
                }
            },{new:true},
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            },
        }).exec();
        //return response
        return res.status(200).json({
                success:true,
                message:"Section created successfully",
                updatedCourseDetails,
            })
    }
    catch(err)
    {
        return res.status(500).json({
                success:false,
                message:"Unable to create section",
                err:err.message,
            })
    }
}

exports.updateSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName,sectionId}=req.body;

        //validation
        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success:false,
                message:"Missing properties",
                
            })
        }

        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return response
         return res.status(200).json({
                success:true,
                message:"Section updated successfully",
                
            })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:err.message,
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try{

        //get id
        const {sectionId,courseId}=req.body;

        // Remove the section from the course
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        });
        //Find section to delete its subsections
        const section=await Section.findById(sectionId);
        if(!section){
            return res.status(404).json(
                { 
                    success: false, message: "Section not found" 
                });
        }
        // Delete all subsections within the section
        await Subsection.deleteMany({_id: {$in: section.subSection}});

        // Delete the section itself
        await Section.findByIdAndDelete(sectionId);

        //return fresponse
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully",
            
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section",
            error:err.message,
        })
    }
}