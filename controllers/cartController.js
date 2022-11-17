const express = require("express");

const { validationResult } = require("express-validator");

const Page = require("../models/page");
const Product = require("../models/product");

exports.getAddToCart = (req, res, next) => {
    const slug = req.params.product;
  Product.findOne({ slug: slug})
    .then((p) => {
      if (!p) {
        return res.redirect("/");
      }
      if(typeof req.session.cart =="undefined"){
        req.session.cart = [];
        req.session.cart.push({
                title:slug,
                qty:1,
                price:parseFloat(p.price).toFixed(2),
                image:p.image,
        })

      }else{
        let cart = req.session.cart;
        let newItem = true;
       
        for (let i = 0; i < cart.length; i++) {
            if(cart[i].title==slug){
                cart[i].qty++;
                newItem = false;
                break;
            }
            
        }

        if(newItem){
            cart.push({
                title:slug,
                qty:1,
                price:parseFloat(p.price).toFixed(2),
                image:p.image,
            })

        }
      }
    
      req.flash("success","product added to cart");
      res.redirect('back');

    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getCheckout = (req,res,next)=>{
    res.render('checkout',{
        title:"Checkout",
        cart:req.session.cart
    })




}

exports.getUpdateProduct = (req,res,next)=>{
    const slug = req.params.product;

    const cart = req.session.cart;

    const action= req.query.action;

    for (let i = 0; i < cart.length; i++) {
        if(cart[i].title==slug){
            switch(action){
                case 'add':
                    cart[i].qty++;
                    break;
                case 'remove':
                    cart[i].qty--;
                    if(cart[i].qty==0){
                        delete req.session.cart
                    }
                    break;
                case 'clear':
                    cart.splice(i,1);
                    if(cart.length ==0) delete req.session.cart;
                    break;
                default:
                    console.log("updated Problems");
                    break;
            
            }
            break;
        }
       
    }
    
    req.flash('success',"Cart updated");
    res.redirect('/cart/checkout')

}

exports.getClearCart = (req,res,next)=>{
    delete req.session.cart ;

    req.flash('success',"delete cart");
    res.redirect('/cart/checkout')
}

exports.getBuynow = (req,res,next)=>{

delete req.session.cart;

res.sendStatus(200)


}