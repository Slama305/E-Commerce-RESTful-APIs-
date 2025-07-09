const asyncHandler = require('express-async-handler');
const Category = require('../models/Category.model');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');    
const Factory = require('./handlersFactory');
// @desc    Create a new category
// @route   POST /api/categories
// @access  private
const createCategory = Factory.createOne(Category);
// @desc get all categories
// @route GET /api/categories
// @access Public
const getCategories = Factory.getAll(Category);
// @desc get single category by id
// @route GET /api/categories/:id
// @access public
const getCategory = Factory.getOne(Category);
// @desc update a category
// @route PUT /api/categories/:id
// @access private
const updateCategory = Factory.updateOne(Category);
// @desc delete a category
// @route DELETE /api/categories/:id
// access private
const deleteCategory = Factory.deleteOne(Category);

// Exporting the functions to be used in routes
module.exports = {
   createCategory,
   getCategories,
   getCategory, 
   updateCategory,
   deleteCategory
}