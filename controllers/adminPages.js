const express = require("express");

const { validationResult } = require("express-validator");

const Page = require("../models/page");

exports.getHomeWithSlug = (req, res, next) => {
  Page.findOne({ slug: "home" })
    .then((page) => {
      if (!page) {
        return res.redirect("/");
      }
      res.render("index", {
        title: page.title,
        content: page.content,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getPageWithSlug = (req, res, next) => {
  const slug = req.params.slug;

  Page.findOne({ slug: slug })
    .then((page) => {
      if (!page) {
        return res.redirect("/");
      }
      res.render("index", {
        title: page.title,
        content: page.content,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
