const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');


const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require('../utils/validator/productValidator');
// Route to get all products
router.route('/')
    .get(
        productController.getAllProducts
    )
    .post(
        // Validate the request body before creating a product
        createProductValidator,
        productController.createProduct
    );
// Route to get a single product by ID
router.route('/:id')
    .get(
        getProductValidator,
        productController.getProductById
    )
    .put(
        updateProductValidator,
        productController.updateProduct
    )
    .delete(
        deleteProductValidator,
        productController.deleteProduct
    );
    
// Export the router
module.exports = router;   