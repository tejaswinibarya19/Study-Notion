const  Category=require("../models/Category");
const Course = require("../models/Course");

exports.createCategory=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are requitred",
            })
        }

        const CategoryDetails=await Category.create({
            name:name,
            description:description,
        });

        console.log(CategoryDetails);
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
        });
    }
    catch(err)
    {
        return res.status(500).json({
            success:true,
            message:err.message,
        });
    }
};

exports.showAllCategories=async (req,res) => {
    try{
        const allCategorys=await Category.find({},
            {name:true,description:true}
        );

        return res.status(200).json({
            success:true,
            data:allCategorys,
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    } 
};

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Get courses for the specified category
        // The 'status' filter has been REMOVED to match your schema
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                populate: "ratingAndReviews instructor",
            })
            .exec();

        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.");
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Handle the case when there are no courses in the category
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for this category.");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }
        
        // Get courses from different categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        }).populate({
            path: "courses",
            populate: "instructor"
        });

        let differentCourses = categoriesExceptSelected.flatMap(category => category.courses);

        // Get top-selling courses across all categories
        const allCategories = await Category.find().populate({
            path: "courses",
             populate: {
                path: "instructor",
            },
        });
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
            .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
            .slice(0, 10);

        // Return the final structured response
        return res.status(200).json({
            success: true,
            data: {
                selectedCourses: selectedCategory.courses,
                differentCourses: differentCourses,
                mostSellingCourses: mostSellingCourses,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Unable to fetch category page details.",
            error: err.message,
        });
    }
};