const express = require('express');

const userControll = require('../controller/users');

const router = express.Router();

router
    .route('/')
    .post(
        userControll.userValidation(),
        userControll.signup);


router
    .route('/login')
    .post(
        userControll.userloginValidation(),
        userControll.login)


module.exports = router;
