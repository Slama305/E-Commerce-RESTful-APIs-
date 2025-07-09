const express = require('express');
const router = express.Router({ mergeParams: true }); // ✅

const subCategoryController = require('../controllers/subCategory.controller');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} = require('../utils/validator/subCategoryValidator');

// Route to create a new subcategory
router.route('/')
  .post(
    subCategoryController.setSubCategoryParams, // ✅ مهم عشان nested
    createSubCategoryValidator,
    subCategoryController.createSubCategory
  )
  .get(
    subCategoryController.createFilter, // ✅ فلترة حسب categoryId لو موجود
    subCategoryController.getAllSubCategories
  );

// Route to get a subcategory by ID
router.route('/:id')
  .get(
    getSubCategoryValidator,
    subCategoryController.getSubCategoryById
  )
  .put(
    updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
