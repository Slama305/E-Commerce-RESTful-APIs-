const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
// Import validators
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    updateUserPasswordValidator
} = require('../utils/validator/userValidator');

router.use(authController.protect);

router.route('/getMe').get(userController.getMe , userController.getUserById);
router.route('/updateMyPassword').put( userController.updateMePassword);
router.route('/updateMyData').put( userController.updateUserData);
router.route('/deleteMe').put( userController.deleteUserData);




router.use(authController.allowedTo('admin'));

router.route('/')
    .get( userController.getAllUsers)
    .post(createUserValidator , userController.createUser);
router.route('/:id')
    .get(getUserValidator,userController.getUserById)
    .put(updateUserValidator,userController.updateUser)
    .delete(deleteUserValidator,userController.deleteUser);
// Password update route
router.route('/changePassword/:id')
    .put(updateUserPasswordValidator,userController.updateUserPassword);
// Export the router
module.exports = router;
