const express = require("express");
const router = express.Router();
const {getAddToCart,getCheckout,getUpdateProduct,getClearCart,getBuynow} = require('../controllers/cartController');
router.get("/add/:product",getAddToCart);

router.get('/checkout',getCheckout);

router.get('/update/:product',getUpdateProduct);

router.get('/clear',getClearCart);

router.get('/buynow',getBuynow);
module.exports = router;
