const express = require('express');
const router = express.Router();
const {signup , login , forgotPassword , verifyResetCode ,resetPassword} = require('../controllers/auth.controller');

// Import validators
const {
   signupValidator, 
    loginValidator 
} = require('../utils/validator/authValidator');
router.route('/signup')
    .post(signupValidator, signup);
    
router.route('/login')
    .post(loginValidator, login);

router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.put('/resetPassword', resetPassword);

// Export the router
module.exports = router;
