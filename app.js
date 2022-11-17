const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const config = require("./config/database");
const pages = require("./routes/pages");
const adminPages = require("./routes/admin_pages.js");
const bodyParser = require("body-parser");
const session = require("express-session");
const adminCategoryRoutes = require("./routes/admin_categories");
const adminProductsRoutes = require("./routes/admin_products");
// const fileUpload = require("express-fileupload");
// const expressValidator = require("express-validator");
const multer = require("multer");
const Page = require('./models/page');
const Category = require('./models/category');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const passport = require('passport');
const userRoutes =require('./routes/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const currentDate = new Date().toISOString();
    const customDate = currentDate.replace(/:/g, "-");
    cb(null, customDate + "-" + file.originalname);
  },
});

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "mustbeauniquesessiontonotgethacking",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.locals.errors = null;



Page.find({})
.sort({ sorting: 1 }).exec()
.then((pages) => {
 app.locals.pages = pages;
})
.catch((err) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
});

Category.find({})
.then((categories) => {
 app.locals.categories = categories;
})
.catch((err) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
});
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('*',(req,res,next)=>{
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
})

app.use("/admin/pages", adminPages);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/admin/products", adminProductsRoutes);
app.use('/products',productsRoutes);
app.use('/cart',cartRoutes);
app.use('/users',userRoutes);
app.use("/", pages);

mongoose
  .connect(config.database)
  .then(() => {
    console.log("Database connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
