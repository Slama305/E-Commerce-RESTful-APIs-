const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true , "brand required"] , 
    unique: true, 
    minlength: [3, 'brand name must be at least 3 characters long'], 
    maxlength: [32, 'brand name must not exceed 50 characters'],

   },
   slug: {
    type: String,
    lowercase: true,
   },
    imgage: { type: String},
  },
 
  { 
    timestamps: true
 }
);
  
const BrandModel = mongoose.model('Brand', brandSchema);
module.exports = BrandModel;