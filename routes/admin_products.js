const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
const resizeImg = require("resize-img");
const Product = require("../models/product");
const adminProductsController = require("../controllers/adminProd");
const path = require("path");
const auth = require('../config/auth');
router.get("/",auth.isAdmin, adminProductsController.getProducts);
router.get("/add-product",auth.isAdmin, adminProductsController.getAddProduct);
router.post(
  "/add-product",
  [
    body("title", "Title must have a value").notEmpty(),
    body("desc", "Description Must have a value").notEmpty(),
    body("price", "Price must have a value").isDecimal(),
  ],
  adminProductsController.postAddProduct
);

router.get('/edit-product/:id',auth.isAdmin,adminProductsController.getEditProduct);
router.post('/edit-product/:id',[
  body("title", "Title must have a value").notEmpty(),
  body("desc", "Description Must have a value").notEmpty(),
  body("price", "Price must have a value").isDecimal(),

],auth.isAdmin,adminProductsController.postEditProduct);
// router.post('/product-gallery/:id',adminProductsController.postProductGallery);
router.get('/delete-product/:id',auth.isAdmin,adminProductsController.getDeleteProduct);

/* router.post(
  "/add-page",
  [
    body("title", "Enter a Valid Title").notEmpty().isLength({ min: 2 }),
    body("content", "Enter a Valid Content")
      .notEmpty()
      .isLength({ min: 10 })
      .isString(),
  ],
  postAddPages
);

router.post("/reorder-pages", reorderPages);

router.post("/edit-page/:id",
[
  body("title", "Enter a Valid Title").notEmpty().isLength({ min: 2 }),
  body("content", "Enter a Valid Content")
    .notEmpty()
    .isLength({ min: 10 })
    .isString(),
]
,postEditPage);
router.get("/edit-page/:id",getEditPage);

router.get('/delete-page/:id',deletePage) */

module.exports = router;
