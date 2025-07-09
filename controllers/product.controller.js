const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Factory = require('./handlersFactory');
// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private (Admin)
const createProduct = Factory.createOne(Product);
// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getAllProducts = Factory.getAll(Product);
// @desc    Get a product by ID
// @route   GET /api/v1/products/:id
// @access Public
const getProductById = Factory.getOne(Product);
// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin)
const updateProduct = Factory.updateOne(Product);
// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
const deleteProduct = Factory.deleteOne(Product);

// Export the controller functions
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};






