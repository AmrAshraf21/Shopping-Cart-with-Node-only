const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const Page = require("../models/page");
const mkdirp = require("mkdirp");
const fileHelper = require('../util/fileHelper');


exports.getProducts = async (req, res, next) => {
  try {
    let count = await Product.count();
    let products = await Product.find();

    res.render("admin/products", {
      products: products,
      count: count,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddProduct = (req, res, next) => {
  const title = "";
  const desc = "";
  const price = "";

  Category.find()
    .then((categories) => {
      res.render("admin/add_product", {
        title: title,
        desc: desc,
        categories: categories,
        price: price,
        categories: categories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;
  const image = req.file;
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const errors = validationResult(req);
  console.log(image);

  if (!image) {
    return Category.find().then((categories) => {
      return res.status(422).render("admin/add_product", {
        errors: errors,
        title: title,
        desc: desc,
        categories: categories,
        price: price,
        errorMessage: "Image not provided",
      });
    });
  }
  if (!errors.isEmpty()) {
    return Category.find().then((categories) => {
      return res.render("admin/add_product", {
        errors: errors,
        title: title,
        desc: desc,
        categories: categories,
        price: price,
        errorMessage: errors.array()[0].msg,
      });
    });
  }
  Product.findOne({ slug: slug })
    .then((product) => {
      if (product) {
        req.flash("danger", "Product title exists , choose another");
        return Category.find().then((categories) => {
          res.render("admin/add_product", {
            title: title,
            desc: desc,
            categories: categories,
            price: price,
          });
        });
      } else {
        const imageUrl = image.path;
        const product = new Product({
          title: title,
          price: parseFloat(price).toFixed(2),
          desc: desc,
          category: category,
          image: imageUrl,
          slug: slug,
        });
        return product.save().then((result) => {
          res.redirect("/admin/products");
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const error = validationResult(req);
  let errors;
  if (req.session.errors) {
    errors = req.session.errors;
  }
  req.session.errors = null;

  Category.find()
    .then((categories) => {
      return Product.findById(req.params.id).then((p) => {
        
        if (!p) {
          return res.redirect("admin/products");
        }
        
        res.render("admin/edit_product", {
          id:p._id,
            title:p.title,
            desc:p.desc,
            categories:categories,
            price:p.price,
            category:p.category.replace('/\s+/g','-').toLowerCase(),
            image:p.image,      
            errorMessage: null,
         
          // isAuth: req.session.isLoggedIn,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.postEditProduct = (req,res,next)=>{
  const updatedTitle = req.body.title;
  const updatedDesc = req.body.desc;
  const updatedPrice = req.body.price;
  const updatedCategory = req.body.category;
  const image = req.file;
  const id = req.params.id
  const slug = updatedTitle.replace(/\s+/g, "-").toLowerCase();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return Category.find().then((categories) => {
      return res.render("/admin/products/edit-product/"+id, {
        errors: errors,
        title: updatedTitle,
        desc: updatedDesc,
        categories: categories,
        price: updatedPrice,
        category:updatedCategory,
        errorMessage: errors.array()[0].msg,
      });
    });
  }
  Product.findOne({slug:slug,}).then(p=>{
      if(p){
        req.flash('danger',"Product title exits , choose another");
        return res.redirect("/admin/products/edit-product/"+id)
      }
    return  Product.findById(id).then((p)=>{
      console.log(p);
        if(image){
          console.log("---------------PATH-------------");
          console.log(image.path);
          
          fileHelper.deleteFile(p.image);
          p.image = image.path;
        }
        p.title =updatedTitle;
        p.slug =slug;
        p.price = parseFloat(updatedPrice).toFixed(2);
        p.category  = updatedCategory;
        
       return p.save().then(()=>{
        req.flash("success","product updated");
          console.log("Updated product");
         return res.redirect('/admin/products')
        })
    })

      

  }).catch(err=>{
    console.log(err);
  })


}

exports.getDeleteProduct=async(req,res,next)=>{
const id = req.params.id;
try {
const {image}=  await Product.findById(id);
fileHelper.deleteFile(image);

await Product.findByIdAndRemove(id);
  req.flash('success',"deleted Product");
  res.redirect('/admin/products');
  
} catch (error) {
  console.log(error);
}


}

// exports.postEditProduct = (req, res) => {
 


//   if (!errors.isEmpty()) {
//     return res.status(422).render("admin/edit-product", {
//       pageTitle: "Add Product",
//       path: "/admin/edit-product",
//       editing: true,
//       hasError: true,
//       product: {
//         title: updatedTitle,
//         //imageUrl: updatedImageUrl,
//         price: updatedPrice,
//         description: updatedDesc,
//         _id: prodId,
//       },
//       // isAuth: req.session.isLoggedIn,
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array(),
//     });
//   }

//   // const product = new Product(updatedTitle,updatedPrice,updatedDesc,updatedImageUrl,prodId)
//   Product.findById(prodId)
//     .then((product) => {
//       if (product.userId.toString() !== req.user._id.toString()) {
//         return res.redirect("/");
//       }
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       if(image){
//         fileHelper.deleteFile(product.imageUrl);
//         product.imageUrl = image.path;
//       }
//       return product.save().then((result) => {
//         // console.log("Updated Product");
//         res.redirect("/admin/products");
//       });
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };