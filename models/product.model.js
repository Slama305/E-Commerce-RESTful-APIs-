const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Product title must be at least 3 characters long'],
        maxlength: [100, 'Product title must not exceed 100 characters']
    },
    slug: {
        type: String,
        required : true,
        lowercase: true 
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required']
    },
    sold : {
        type: Number,    
        default : 0
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim:true,
        min: [0, 'Price cannot be negative']
    },
    colors : [String],
    priceAfterDiscount : {
        type: Number,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        // required: true
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        // required: true
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [1, 'Rating must be above or equal to 1.0'],
        max: [5, 'Rating must be below or equal to 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    imageCover: {
        type: String,
        required: [true, 'Product image Cover is required'],
 
    }
    }, { timestamps: true });
productSchema.pre(/^find/, function(next) {
   this.populate({
    path: 'category',
    select: 'name -_id'
   })
   next();
});

const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;
