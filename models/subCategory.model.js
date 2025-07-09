const mongoose = require('mongoose');
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subcategory name is required'],
    trim: true,
    unique: [true, 'Subcategory name must be unique'],
    minlength: [3, 'Subcategory name must be at least 3 characters long'],
    maxlength: [32, 'Subcategory name must be at most 32 characters long']
  },
  slug: {
    type: String,
    lowercase: true,
   },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Subcategory must belong to a category']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SubCategory', subCategorySchema);