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
} = require("../controllers/adminCont");
router.get("/", getPages);

router.get("/add-page", getAddPages);

router.post(
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


module.exports = router;
