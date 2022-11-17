const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getAddPages,
  getPages,
  postAddPages,
  reorderPages,
  getEditPage,
  postEditPage,
  deletePage
} = require("../controllers/adminCont");
const auth = require('../config/auth');

router.get("/",auth.isAdmin ,getPages);

router.get("/add-page", auth.isAdmin,getAddPages);

router.post(
  "/add-page",
  [
    body("title", "Enter a Valid Title").notEmpty().isLength({ min: 2 }),
    body("content", "Enter a Valid Content")
      .notEmpty()
      .isLength({ min: 10 })
      .isString(),
  ],auth.isAdmin,
  postAddPages
);

router.post("/reorder-pages",auth.isAdmin, reorderPages);

router.post("/edit-page/:id",
[
  body("title", "Enter a Valid Title").notEmpty().isLength({ min: 2 }),
  body("content", "Enter a Valid Content")
    .notEmpty()
    .isLength({ min: 10 })
    .isString(),
],auth.isAdmin
,postEditPage);
router.get("/edit-page/:id",auth.isAdmin,getEditPage);

router.get('/delete-page/:id',auth.isAdmin,deletePage)


module.exports = router;
