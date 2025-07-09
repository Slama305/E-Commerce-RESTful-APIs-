const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const ApiError = require('./utils/apiError');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
dotenv.config({ path: '.env' });

// logs in Development mode
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Development mode: ${process.env.NODE_ENV}`);
}

// Database connection
const dbConnection = require('./config/database');
dbConnection();
// Routes
// Category routes
const categoryRoutes = require('./routes/category.route');
app.use('/api/v1/categories', categoryRoutes);

// SubCategory routes
const subCategoryRoutes = require('./routes/subCategory.route');
app.use('/api/v1/subcategories', subCategoryRoutes);

// Brand routes
const brandRoutes = require('./routes/brand.route');
app.use('/api/v1/brands', brandRoutes);

// Product routes
const productRoutes = require('./routes/product.route');
app.use('/api/v1/products', productRoutes);


// // Handle undefine route
// app.all('*', (req, res, next) => {
//   next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
// });



// Global error Handling
const globalError = require('./middlewares/errorMiddleware')
app.use(globalError);

// listen on port
const port = process.env.PORT ;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// handle uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  // Optionally, you can exit the process
  server.close(() => {
    console.error('Shutting down server due to unhandled rejection');
    process.exit(1); // Exit with failure code
  });
});



// video 56 ===> need reviwe








