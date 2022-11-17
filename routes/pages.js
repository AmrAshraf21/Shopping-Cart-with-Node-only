const express = require("express");
const router = express.Router();
const adminControllerPages = require('../controllers/adminPages');
router.get("/",adminControllerPages.getHomeWithSlug);

router.get('/:slug',adminControllerPages.getPageWithSlug);

module.exports = router;
