const mongoose=require("mongoose");

const ratingAndReviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
        trim:true,
    }
})
// Add a compound index to ensure a user can only review a course once
ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports=mongoose.model("RatingAndReview",ratingAndReviewSchema);