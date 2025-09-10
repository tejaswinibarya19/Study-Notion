const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    
    courseName:{
        type:String,
        trim:true,
        required:true,
    },

    courseDescription:{
        type:String,
        trim:true,
        required:true,
    },

    instructor :[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }],

    whatUWillLearn:{
        type:String,
    },
    
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],

    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],

    price:{
        type:Number
    },

    thumbnail:{
        type:String,
    },

    tag: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Tag",
    }],

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },

    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],

    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    }

})
module.exports=mongoose.model("Course",courseSchema);