const express = require('express');
const router = express.Router();
const auth = require('../config/auth');

const {getAllProducts ,getProductByCategory,getProductDetails} = require('../controllers/productsController');
router.get('/',auth.isUser,getAllProducts);

router.get('/:category',getProductByCategory);


router.get('/:category/:product',getProductDetails)




module.exports = router