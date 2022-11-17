const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Page = require("../models/page");
exports.getPages = (req, res, next) => {
  Page.find({})
    .sort({ sorting: 1 })
    .then((pages) => {
      res.render("admin/pages", {
        pages: pages,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getAddPages = (req, res, next) => {
  const title = "";
  const slug = "";
  const content = "";
  res.render("admin/add_page", {
    title: title,
    slug: slug,
    content: content,
  });
};
exports.postAddPages = (req, res, next) => {
  const { title, content } = req.body;
  let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  const errors = validationResult(req);

  if (slug == "") {
    slug = title.replace(/\s+/g, "-").toLowerCase();
  }
  if (!errors.isEmpty()) {
    res.render("admin/add_page", {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
      errorMessage: errors.array()[0].msg,
    });
  } else {
    Page.findOne({ slug: slug })
      .then((result) => {
        if (result) {
          req.flash("danger", "page Slug already Exists");
          res.render("admin/add_page", {
            title: title,
            slug: slug,
            content: content,
          });
        } else {
          const page = new Page({
            title: title,
            slug: slug,
            content: content,
            sorting: 100,
          });

          return page.save().then((pageRes) => {
          return  Page.find({}).sort({sorting:1}).exec().then(pages=>{
              req.app.locals.pages = pages;
              req.flash("success", "Page Added");
             res.redirect("/admin/pages");
            })
            
          });
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};

exports.reorderPages = async (req, res, next) => {
  const ids = req.body["id[]"];
  let count = 0;
  for (let i = 0; i < ids.length; i++) {
    var id = ids[i];
    count++;
    try {
      const page = await Page.findById(id);
      page.sorting = count;
      await page.save();
      const pages = await Page.find({}).sort({sorting:1}).exec();
      req.app.locals.pages = pages;
    } catch (error) {
      console.log(error);
    }
  }
  


};
exports.getEditPage = (req, res, next) => {
  const id = req.params.id;
  Page.findById(id)
    .then((result) => {
      if (!result) {
        return res.render("admin/add_page", {
          title: title,
          slug: slug,
          content: content,
        });
      }
      res.render("admin/edit_page", {
        title: result.title,
        slug: result.slug,
        content: result.content,
        _id: result._id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postEditPage = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const updatedSlug = req.body.slug;
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/edit_page", {
      errors: errors,
      title: updatedTitle,
      slug: updatedSlug,
      content: updatedContent,
      errorMessage: errors.array()[0].msg,
      _id: id,
    });
  }
  Page.findOne({ slug: updatedSlug })
    .then((slug) => {
      if (slug) {
        req.flash(
          "danger",
          "Page Slug is already exists, please choose another one"
        );
        return res.render("admin/edit_page", {
          title: updatedTitle,
          content: updatedContent,
          slug: updatedSlug,
          _id: id,
        });
      }

      Page.findByIdAndUpdate(id, {
        title: updatedTitle,
        content: updatedContent,
        slug: updatedSlug,
      }).then((result) => {
       return Page.find({}).sort({sorting:1}).exec().then(pages=>{
          req.app.locals.pages = pages;
          
          console.log("Done updateing from postEditUpdated");
          req.flash("success", "page added");
          res.redirect("/admin/pages/edit-page/"+id);
        })
       
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.deletePage = (req, res, next) => {
  const id = req.params.id;
  Page.findByIdAndRemove(id)
    .then((deletePage) => {
      if(deletePage){
        return Page.find({}).sort({sorting:1}).exec().then(pages=>{
          req.app.locals.pages = pages;

          req.flash("success","page deleted");
          return res.redirect('/admin/pages');
        })
      }

    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
