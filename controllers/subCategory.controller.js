const slugyfy = require('slugify');
const SubCategory = require('../models/subCategory.model');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Factory = require('./handlersFactory');
const setSubCategoryParams = (req, res, next) => {
  if(!req.body.category) {
    req.body.category = req.params.categoryId; // Use categoryId from params if not provided in body
  }
  next();
}

// @desc    Create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private (Admin)
const createSubCategory = Factory.createOne(SubCategory);

const createFilter = (req ,res , next) => {
    let filter = {};
    if (req.params.categoryId) {
        filter = { category: req.params.categoryId };
    }
    req.filter = filter; // Attach filter to request object for use in getAllSubCategories
    next();
}
// @desc    Get all subcategories
// @route   GET /api/v1/subcategories
// @access  Public
const getAllSubCategories = Factory.getAll(SubCategory);
// @desc    Get a subcategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSubCategoryById = Factory.getOne(SubCategory);
// @desc    Update a subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private (Admin)
const updateSubCategory = Factory.updateOne(SubCategory);
// @desc    Delete a subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private (Admin)
const deleteSubCategory = Factory.deleteOne(SubCategory);
// Exporting the functions to be used in routes
module.exports = {
  setSubCategoryParams,
  createSubCategory,
  createFilter,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};