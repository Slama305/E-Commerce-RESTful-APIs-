const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true , "category required"] , 
    unique: true, 
    minlength: [3, 'Category name must be at least 3 characters long'], 
    maxlength: [32, 'Category name must not exceed 50 characters'],

   },
   slug: {
    type: String,
    lowercase: true,
   }
   
  },
  { 
    timestamps: true
 }
);
  
const CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;