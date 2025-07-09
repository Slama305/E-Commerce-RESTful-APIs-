const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const {
    createBrandValidator,
    getBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validator/brandValidator');
// Route to get all brands
router.route('/')
    .get(brandController.getAllBrands)
    .post(
        createBrandValidator,
        brandController.createBrand
    );
// Route to get a single brand by ID
router.route('/:id')
    .get(
        getBrandValidator,
        brandController.getBrandById
    )
    .put(
        updateBrandValidator,
        brandController.updateBrand
    )
    .delete(
        deleteBrandValidator,
        brandController.deleteBrand
    );
// Export the router
module.exports = router;    