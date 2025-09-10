const express=require("express");
const router=express.Router();

const{createCourse,showAllCourses,getCourseDetails}=require("../controllers/Course");

const {showAllCategories,createCategory,categoryPageDetails}=require("../controllers/Category");

const {createSection,updateSection,deleteSection}=require("../controllers/Section")

const {updateSubSection,deleteSubSection,createSubSection}=require("../controllers/Subsection");

const {createRating,getAverageRating,getAllRating}=require("../controllers/RatingAndReview");

const {auth,isInstructor,isStudent,isAdmin}=require("../middlewares/auth");

// Course Routes
router.post("/createCourse",auth,isInstructor,createCourse);

router.get("/showAllCourses",auth,isInstructor,showAllCourses);

router.post("/getCourseDetails",auth,getCourseDetails);

//Section Routes
router.post("/addSection",auth,isInstructor,createSection);

router.post("/updateSection",auth,isInstructor,updateSection);

router.post("/deleteSection",auth,isInstructor,deleteSection);


//Subsection Routes
router.put("/updateSubSection",auth,isInstructor,updateSubSection);

router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection);

router.post("/createSubSection",auth,isInstructor,createSubSection);


//Category Routes
router.post("/createCategory",auth,isAdmin,createCategory);

router.get("/showAllCategories",showAllCategories);

router.post("/getcategoryPageDetails",categoryPageDetails);


//Rating And Reviw Routes
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRating);

module.exports=router;