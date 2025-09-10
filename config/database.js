const mongoose=require("mongoose");
require("dotenv").config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB conneced successfully");
    })
    .catch((err)=>{
        console.log("DB connection failed");
        process.exit(1);
    })
}