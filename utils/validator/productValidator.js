const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/Category.model');
const SubCategory = require('../../models/subCategory.model');    
exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Product name must be between 3 and 50 characters long'),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Product description must be between 10 and 500 characters long'),
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Sold quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number')
    .toFloat()
    .custom((value, { req }) => {
        if (value < 0) {
            throw new Error('Price after discount cannot be negative');
        }
        if (req.body.price && value > req.body.price) {
            throw new Error('Price after discount cannot be greater than the original price');
        }
        return true;
        }),
  check('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),   
  check('imageCover')
    .notEmpty()
    .withMessage('Cover image is required'),
  check('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID format')
    .custom(async (val) => {
      const category = await Category.findById(val);
        if (!category) {
            throw new Error(`No category found with ID: ${val}`);
        }
        return true;
            }),
  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  check('subCategory')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array of IDs')
    .custom(async (val) => {
        if (val.length > 0) {
            const subCategories = await SubCategory.find({ _id: { $exists: true , $in: val } });
            if (subCategories.length !== val.length) {
                throw new Error('One or more subcategory IDs are invalid');
            }
        }
        return true;   
    })
    .custom( (val ,{req}) => {
      SubCategory.find({ category: req.body.category }).then((subCategories) => {
        const subCategoryIds = subCategories.map(sub => sub._id.toString());
        const invalidSubCategories = val.filter(subId => !subCategoryIds.includes(subId));
        if (invalidSubCategories.length > 0) {
          throw new Error(`Invalid subcategory IDs: ${invalidSubCategories.join(', ')}`);
        }
        return true;
      });
    }),

  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Ratings average must be a number')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings average must be between 1 and 5'),
    check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('Ratings quantity must be a number'),
  validatorMiddleware
];
exports.getProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  validatorMiddleware
];
exports.updateProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  check('title')
    .optional()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ min: 3, max: 50 })
    .withMessage('Product name must be between 3 and 50 characters long'),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Product description cannot be empty')
    .isLength({ min: 10, max: 500 })
    .withMessage('Product description must be between 10 and 500 characters long'),
  check('quantity')
    .optional()
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Sold quantity must be a number'),
  check('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number')
    .toFloat()
    .custom((value, { req }) => {
        if (value < 0) {
            throw new Error('Price after discount cannot be negative');
        }
        if (req.body.price && value > req.body.price) {
            throw new Error('Price after discount cannot be greater than the original price');
        }
        return true;
        }),
  check('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  check('imageCover')
    .optional()
    .notEmpty()
    .withMessage('Cover image is required'),
  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format'),
  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  check('subCategory')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array of IDs'),
  check('ratingsAverage')
      .optional()
      .isNumeric()
      .withMessage('Ratings average must be a number')
      .isFloat({ min: 1, max: 5 })
      .withMessage('Ratings average must be between 1 and 5'),
          check('ratingsQuantity')
                  .optional()
                    .isNumeric()
                    .withMessage('Ratings quantity must be a number'),
                        validatorMiddleware
                        ];
exports.deleteProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    validatorMiddleware
    ];
