const express = require("express");
const router = express.Router();
const {check,body} = require('express-validator');
const {getRegister,postRegister,getLogin,postLogin,getLogout} = require('../controllers/userControllers');
router.get('/register',getRegister)

router.post('/register',[
check('name',"Name is required").notEmpty(),
check('email',"email is required").isEmail(),
check('username',"user name is required").notEmpty(),
check('password',"Password is required").notEmpty(),
check('password2').notEmpty().custom((val,{req})=>{
    if(val !==req.body.password){
        throw new Error("Password do not match");
    }
    return true
})
],postRegister)
router.get('/login',getLogin);



router.post('/login',postLogin);

router.get('/logout',getLogout);
module.exports = router;
