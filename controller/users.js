const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt =require('jsonwebtoken');


exports.signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed!');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const username = req.body.username;
        const email = req.body.email;
        const location = req.body.location;
        const password = req.body.password;
        const coinformPass = req.body.confirmpassword;
        
        if (password != coinformPass) {
            const error = new Error('Password doesn`t match!');
            error.statusCode = 422;
            throw error;
        }
        const pasword = await bcryptjs.hash(password, 10);
        const user = new User(null, username, email, location, pasword);
        await user.save();
        const adduser = {
            email: user.email,
            location: user.location,
            username: user.username
        }
        res.status(200).json({message:"suign up success",user:adduser});
    }
    catch (err) {
        next(err);
    }
};

exports.userValidation = () => {
    let validation = [
        body('email').
            isEmail()
            .withMessage('Enter A vaild Email!')
            .custom((value, { req }) => {
                return User.findByEmail(value)
                    .then(user => {
                        let arr = new Array();
                        arr = user[0];
                        if (arr.length != 0) {
                            return Promise.reject('E-mail address already exists!');
                        }
                    })
            }),
        body('password').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "i")
            .withMessage(("Password minimum eight characters, at least one letter Uppercase ,at least one letter Lowercase and one number and one Special characters"))
            .not().isEmpty().withMessage(("Password mustn't Empty")),
            body('confirmpassword').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "i")
            .withMessage(("confirmpassword minimum eight characters, at least one letter Uppercase ,at least one letter Lowercase and one number and one Special characters"))
            .not().isEmpty().withMessage(("Password mustn't Empty")),
        body('username').trim().not().isEmpty().withMessage(("username mustn't Empty")),
        body('location').trim().not().isEmpty().withMessage(("location mustn't Empty")),

    ];
    return validation;
};

exports.userloginValidation = () => {
    let validation = [
        body('email').
            isEmail()
            .withMessage('Enter A vaild Email!')
            .custom((value, { req }) => {
                return User.findByEmail(value)
                    .then(user => {
                        let arr = new Array();
                        arr = user[0];
                        if (arr.length != 0) {
                            return Promise.reject('E-mail address already exists!');
                        }
                    })
            }),
        body('pasword').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "i")
            .withMessage(("Password minimum eight characters, at least one letter Uppercase ,at least one letter Uppercase and one number"))
            .not().isEmpty().withMessage(("Password mustn't Empty")),
    ];
    return validation;
};


exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let loadeduser;
        const user = await User.findByEmail(email)
        let arr = new Array();
        arr = user[0];
        console.log(req.body)
        if (arr.length == 0) {
            const error = new Error('No Such User Exist!');
            error.statusCode = 401;
            throw error;
        }
        loadeduser = arr[0];
        const isEqual = await bcryptjs.compare(password, loadeduser.pasword);
        if (!isEqual) {
            const error = new Error('Wrong Password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadeduser.email,
            userId: loadeduser._id
        }, "beornottobethisisthequestion", 
        {expiresIn: '1d'}
        );
        res.status(200).json({message:"Login Success",token:token})
    }
    catch (err) {

        next(err);
    }
};
