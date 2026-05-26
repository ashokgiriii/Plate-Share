const express = require("express");
const router = express.Router();
const ensureAuthenticated = require('../config/ensureAuthenticated');
const Donation = require('../models/donation')
const deleteExpiredDonations = require('../config/cronJobs'); // Adjust path if needed
deleteExpiredDonations(); // Start the scheduled task

const footerData = require('../data/footerData');
const foodDetailsData = require('../data/foodDetailsData');
const notFoundData = require('../data/notFoundData');

const mongoose = require('mongoose');

function renderNotFound(req, res) {
  return res.status(404).render('notFound', {
    ...notFoundData,
    footerData,
    requestedUrl: req.originalUrl,
    success: req.flash('success'),
    error: req.flash('error')
  });
}

function validateFoodId(req, res, next) {
  const foodId = req.params.foodId;

  // ✅ Validate the ObjectId format first
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return renderNotFound(req, res);
  }

  next();
}

router.get("/:foodId", validateFoodId, ensureAuthenticated, async function (req, res, next) {
  const foodId = req.params.foodId;

  try {
    const food = await Donation.findById(foodId).populate('user');

    if (!food) {
      return renderNotFound(req, res);
    }

    res.render("foodDetails", {
      ...foodDetailsData,
      footerData,
      food,
      error: req.flash('error'),
      success: req.flash('success')
    });

  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});


module.exports = router;
