const express = require("express");
const User = require("../models/user");
const router = express.Router();

const Testimonial = require("../models/testimonial");
const testimonialData = require("../data/testimonialData");
const footerData = require("../data/footerData");


// Assuming userId is stored in the session after login

router.post("/", async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        req.flash("error", "You must be logged in to submit feedback.");
        return res.redirect("/users/login");
    }

    const message = String(req.body.message || req.body.feedback || "").trim();

    if (!message) {
        req.flash("error", "Please write your feedback before submitting.");
        return res.redirect("back");
    }

    function countWords(str) {
        return str.trim().split(/\s+/).length;
    }

    const wordCount = countWords(message);
    if (wordCount < 5) {
        req.flash("error", "Your feedback must be at least 5 words.");
        return res.redirect("back");
    }

    if (wordCount > 20) {
        req.flash("error", "Your feedback must be no more than 20 words.");
        return res.redirect("back");
    }

    try {
        const feedback = new Testimonial({
            user: userId,
            message: message
        });

        await feedback.save();

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { feedback: feedback._id } },
            { new: true }
        );

        if (!user) {
            await Testimonial.findByIdAndDelete(feedback._id);
            req.flash("error", "User not found.");
            return res.redirect("back");
        }

        req.flash("success", "Feedback submitted successfully!");
        res.redirect("/testimonial");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to submit feedback. Please try again later.");
        res.redirect("back");
    }
});


router.get('/', async function (req, res, next) {
    try {
        // Fetch all feedback and populate the user details
        const feedbacks = await Testimonial.find().sort({ createdAt: -1 }).populate('user');

        res.render('testimonial', {
            ...testimonialData,
            footerData,
            success: req.flash('success'),
            error: req.flash('error'),
            userId: req.session.userId,
            feedbacks: feedbacks
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to load feedback');
        res.redirect('back'); // Redirect back on error
    }
});






module.exports = router;
