const Tag=require("../models/Tags");

//create tag ka handler function
exports.createTag=async(req,res)=>{
    try{
        //fetch data
        const {name,description}=req.body;

        //validation
        if(!name || !description)
        {
            return res.status(400).json({
            success:false,
            message:"Fill all the details",
        })
        }

        //create entry in db
        const tagDetails=await Tag.create({
            name:name,
            description:description,
        });

        //return res
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

//get all tags

exports.showAllTags=async(req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}