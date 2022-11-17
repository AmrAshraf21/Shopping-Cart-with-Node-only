const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const adminCategory = require("../controllers/adminCategory");
const auth = require('../config/auth');


router.get("/", auth.isAdmin,adminCategory.getCategory);
router.get("/add-category", auth.isAdmin,adminCategory.getAddCategory);
router.post("/add-category",
  [check('title').isLength({min:2}).withMessage("Please Enter title")],
  adminCategory.postAddCategory
);

router.get('/edit-category/:id',auth.isAdmin,adminCategory.getEditCategory);
router.post('/edit-category/:id',auth.isAdmin,adminCategory.postEditCategory);
router.get('/delete-category/:id',auth.isAdmin,adminCategory.getDeleteCategory)
// router.get("/add-page", getAddPages);

// router.post(
//   "/add-page",
//   [
//     body("title", "Enter a Valid Title").notEmpty().isLength({ min: 2 }),
//     body("content", "Enter a Valid Content")
//       .notEmpty()
//       .isLength({ min: 10 })
//       .isString(),
//   ],
//   postAddPages
// );

// router.post("/reorder-pages", reorderPages);

// router.post("/edit-page/:id",
// [
//   body("title", "Enter a Valid Title").notEmpty().isLength({ min: 2 }),
//   body("content", "Enter a Valid Content")
//     .notEmpty()
//     .isLength({ min: 10 })
//     .isString(),
// ]
// ,postEditPage);
// router.get("/edit-page/:id",getEditPage);

// router.get('/delete-page/:id',deletePage)

module.exports = router;
