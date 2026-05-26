const express = require('express');
const router = express.Router();
require('dotenv').config();

const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const Donation = require('../models/donation');
const ourTeam = require('../models/ourTeams');
const upload = require('../config/storage');
const ensureAuthenticated = require('../config/ensureAuthenticated');

// ------------------
// Static Data
// ------------------
const indexData = require('../data/indexData');
const aboutData = require('../data/aboutData');
const contactData = require('../data/contactData');
const serviceData = require('../data/serviceData');
const teamData = require('../data/teamData');
const footerData = require('../data/footerData');
const esewaFormData = require('../data/esewaFormData');
const successData = require('../data/successData');
const failureData = require('../data/failureData');
const memeberSignupData = require('../data/memeberSignupData');
const cookiesData = require('../data/cookiesData');
const helpData = require('../data/helpData');
const faqsData = require('../data/faqsData');

// ------------------
// eSewa Configuration
// ------------------
const {
  ESEWA_MERCHANT_CODE,
  ESEWA_SECRET_KEY,
  ESEWA_GATEWAY_URL,
  ESEWA_SUCCESS_URL,
  ESEWA_FAILURE_URL
} = process.env;

// ------------------
// Common Render Data
// ------------------
const commonData = (req) => ({
  footerData,
  userId: req.session.userId,
  success: req.flash('success'),
  error: req.flash('error')
});

// ------------------
// Signature Generator
// ------------------
function generateSignature(
  total_amount,
  transaction_uuid,
  product_code,
  secret_key
) {
  const message =
    `total_amount=${total_amount},` +
    `transaction_uuid=${transaction_uuid},` +
    `product_code=${product_code}`;

  return crypto
    .createHmac('sha256', secret_key)
    .update(message)
    .digest('base64');
}

// ------------------
// Home Page
// ------------------
router.get('/', async (req, res) => {
  try {
    const now = new Date();

    const donations = await Donation.find({
      status: 'claim',
      expiryTime: { $gte: now }
    });

    res.render('index', {
      ...indexData,
      donations,
      ...commonData(req)
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ------------------
// Donate -> eSewa
// ------------------
router.post('/donate', ensureAuthenticated, (req, res) => {
  const { amount, message } = req.body;

  const transaction_uuid = uuidv4();

  const signature = generateSignature(
    amount,
    transaction_uuid,
    ESEWA_MERCHANT_CODE,
    ESEWA_SECRET_KEY
  );

  res.render('esewaForm', {
    ...esewaFormData,
    amount,
    message,
    transaction_uuid,
    product_code: ESEWA_MERCHANT_CODE,
    signature,
    esewaGatewayUrl: ESEWA_GATEWAY_URL,
    success_url: ESEWA_SUCCESS_URL,
    failure_url: ESEWA_FAILURE_URL,
    ...commonData(req)
  });
});

// ------------------
// Payment Success
// ------------------
router.get('/payment/success', (req, res) => {
  res.render('success', {
    ...successData,
    ...commonData(req)
  });
});

// ------------------
// Payment Failure
// ------------------
router.get('/payment/failure', (req, res) => {
  res.render('failure', {
    ...failureData,
    ...commonData(req)
  });
});

// ------------------
// About Page
// ------------------
router.get('/about', (req, res) => {
  res.render('about', {
    ...aboutData,
    ...commonData(req)
  });
});

// ------------------
// Contact Page
// ------------------
router.get('/contact', (req, res) => {
  res.render('contact', {
    ...contactData,
    ...commonData(req)
  });
});

// ------------------
// Service Page
// ------------------
router.get('/service', (req, res) => {
  res.render('service', {
    ...serviceData,
    ...commonData(req)
  });
});

// ------------------
// Cookies Page
// ------------------
router.get('/cookies', (req, res) => {
  res.render('infoPage', {
    ...cookiesData,
    ...commonData(req)
  });
});

// ------------------
// Help Page
// ------------------
router.get('/help', (req, res) => {
  res.render('infoPage', {
    ...helpData,
    ...commonData(req)
  });
});

// ------------------
// FAQs Page
// ------------------
router.get('/faqs', (req, res) => {
  res.render('infoPage', {
    ...faqsData,
    ...commonData(req)
  });
});

// ------------------
// Team Page
// ------------------
router.get('/team', async (req, res) => {
  try {
    const team = await ourTeam.find();

    res.render('team', {
      ...teamData,
      team,
      ...commonData(req)
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ------------------
// Member Signup
// ------------------
router.get('/memeberSignup', (req, res) => {
  res.render('memeberSignup', {
    ...memeberSignupData,
    ...commonData(req)
  });
});

module.exports = router;
