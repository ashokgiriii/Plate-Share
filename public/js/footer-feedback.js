(function () {
    const openFeedbackFormBtn = document.getElementById("openFeedbackFormBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const closeFeedbackFormBtn = document.getElementById("closeFeedbackFormBtn");
    const feedbackInput = document.getElementById("feedbackInput");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const backgroundDimmer = document.getElementById("backgroundDimmer");
    const errorMessage = document.getElementById("errorMessage");

    if (!feedbackForm || !feedbackMessage || !backgroundDimmer) return;

    const isFeedbackFormOpen = function () {
        return feedbackForm.style.display === "block";
    };

    const showFeedbackForm = function () {
        feedbackForm.style.display = "block";
        backgroundDimmer.style.display = "block";
        feedbackMessage.focus();
    };

    const hideFeedbackForm = function () {
        feedbackForm.style.display = "none";
        backgroundDimmer.style.display = "none";
    };

    const getWordCount = function () {
        const message = feedbackMessage.value.trim();
        return message ? message.split(/\s+/).length : 0;
    };

    const validateFeedback = function () {
        const wordCount = getWordCount();
        const isValid = wordCount >= 5 && wordCount <= 20;
        errorMessage.classList.toggle("d-none", isValid || wordCount === 0);
        return isValid;
    };

    if (openFeedbackFormBtn) openFeedbackFormBtn.addEventListener("click", showFeedbackForm);
    if (feedbackInput) feedbackInput.addEventListener("click", showFeedbackForm);
    if (closeFeedbackFormBtn) closeFeedbackFormBtn.addEventListener("click", hideFeedbackForm);

    backgroundDimmer.addEventListener("click", hideFeedbackForm);
    feedbackMessage.addEventListener("input", validateFeedback);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && isFeedbackFormOpen()) {
            hideFeedbackForm();
        }
    });

    feedbackForm.addEventListener("submit", function (event) {
        if (!validateFeedback()) {
            event.preventDefault();
        }
    });
})();
