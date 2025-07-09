const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/e-Commerce-DB';
const dbConnection = () =>{
    
    mongoose.connect(DB_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => {
            console.error('Database connection failed:', error.message);
            process.exit(1);
        });
}

module.exports = dbConnection;