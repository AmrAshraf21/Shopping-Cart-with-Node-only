const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Category = require("../models/category");
exports.getCategory = (req, res, next) => {
  Category.find({})
    .then((categories) => {
      if (categories) {
        return res.render("admin/categories", {
          categories: categories,
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
exports.getAddCategory = (req, res, next) => {
  const title = "";
  res.render("admin/add_category", {
    title: title,
  });
};
exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;
  const slug = title.replace(/\s+/g, "-").toLowerCase();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/add_category", {
      errors: errors,
      title: title,
      slug: slug,
      errorMessage: errors.array()[0].msg,
    });
  } else {
    Category.findOne({ slug: slug })
      .then((result) => {
        if (result) {
          req.flash("danger", "Category title already Exists");
          return res.render("admin/add_category", {
            title: title,
          });
        } else {
          const category = new Category({
            title: title,
            slug: slug,
          });

          return category.save().then((pageRes) => {
            Category.find({})
              .then((categories) => {
                req.app.locals.categories = categories;
              })
              .catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
              });

            req.flash("success", "Category Added");
            res.redirect("/admin/categories");
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

exports.getEditCategory = (req, res, next) => {
  const id = req.params.id;
  Category.findById(id)
    .then((result) => {
      if (!result) {
        return res.render("admin/edit-category", {
          title: result.title,
          _id: result._id,
        });
      }
      res.render("admin/edit_category", {
        title: result.title,
        _id: result._id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditCategory = (req, res, next) => {
  const title = req.body.title;

  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/edit_category", {
      errors: errors,
      title: title,
      errorMessage: errors.array()[0].msg,
      _id: id,
    });
  }
  Category.findOne({ slug: slug })
    .then((cat) => {
      if (cat) {
        req.flash(
          "danger",
          "Category Tilte is already exists, please choose another one"
        );
        return res.render("admin/edit_category", {
          title: title,
          _id: id,
        });
      }

      Category.findByIdAndUpdate(id, {
        title: title,
        slug: slug,
      }).then((result) => {
        Category.find({})
          .then((categories) => {
            req.app.locals.categories = categories;
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });

        req.flash("success", "Categoy Editing ");
        res.redirect(`/admin/categories/edit-category/${id}`);
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteCategory = (req, res, next) => {
  const id = req.params.id;

  Category.findByIdAndRemove(id)
    .then((result) => {
      Category.find({})
        .then((categories) => {
          req.app.locals.categories = categories;
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });

      req.flash("success", "Category deleted");
      res.redirect("/admin/categories");
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
  const id = req.body.id;
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
        console.log("Done updateing from postEditUpdated");
        req.flash("success", "page added");
        res.redirect("/admin/pages");
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
      if (deletePage) {
        req.flash("success", "page deleted");
        return res.redirect("/admin/pages");
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
