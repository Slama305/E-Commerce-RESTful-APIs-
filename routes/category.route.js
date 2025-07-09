const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const {
    createCategoryValidator,
    getCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator

} = require('../utils/validator/categoryValidator');


// Route to get all categories
router.route('/')
    .get(
        categoryController.getCategories
    )
    .post( 
        // Validate the request body before creating a category
        createCategoryValidator,
        categoryController.createCategory
    )

// Route to get a single category by ID
router.route('/:id')
    .get(
        getCategoryValidator,
        categoryController.getCategory
    )
    .put(
        updateCategoryValidator,
        categoryController.updateCategory
    )
    .delete(
        deleteCategoryValidator,
       categoryController.deleteCategory
    );

// nestd route for subcategories
const subCategoryRouter = require('./subCategory.route');
router.use('/:categoryId/subcategories', subCategoryRouter);

module.exports = router;
// Route to update a category









