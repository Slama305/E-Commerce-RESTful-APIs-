const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand.model');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

const Factory = require('./handlersFactory');
// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private (Admin)
const createBrand = Factory.createOne(Brand);
// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
const getAllBrands = Factory.getAll(Brand);
// @desc    Get a brand by ID
// @route   GET /api/v1/brands/:id
const getBrandById = Factory.getOne(Brand);
// @desc    Update a brand
// @route   PUT /api/v1/brands/:id
// @access  Private (Admin)
const updateBrand = Factory.updateOne(Brand);
// @desc    Delete a brand
// @route   DELETE /api/v1/brands/:id
// @access  Private (Admin)
const deleteBrand = Factory.deleteOne(Brand);
// Export the controller functions
module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand
};