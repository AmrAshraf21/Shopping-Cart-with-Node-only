const Product = require("../models/product");
const Category = require("../models/category");
const fs = require("fs-extra");

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      if (!products) {
        return res.redirect("/");
      }
      return res.render("all_products", {
        title: "All Products",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProductByCategory = (req, res, next) => {
  const categorySlug = req.params.category;
  
  return Category.findOne({ slug: categorySlug }).then((c) => {
    return Product.find({ category: categorySlug })
      .then((products) => {
        return res.render("cat_products", {
          title: c.title,
          products: products,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getProductDetails = (req, res, next) => {
    const loggedIn = (req.isAuthenticated()) ? true : false;
  Product.findOne({ slug: req.params.product })
    .then((product) => {
      
      return res.render("product", {
        title: product.title,
        p: product,
        loggedIn:loggedIn
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};
