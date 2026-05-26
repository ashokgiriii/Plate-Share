const footerData = {
  company: {
    title: "Company",
    links: [
      { name: "About Us", url: "/about" },
      { name: "Contact Us", url: "/contact" },
    ],
  },

  contact: {
    title: "Contact",
    address: "Hetauda, Nepal",
    phone: "+977 98546735462",
    email: "plateshare.np@gmail.com",

    socials: [
      { icon: "fab fa-twitter", url: "#" },
      { icon: "fab fa-facebook-f", url: "#" },
      { icon: "fab fa-youtube", url: "#" },
      { icon: "fab fa-linkedin-in", url: "#" },
    ],
  },

  opening: {
    title: "Opening",
    weekdays: {
      days: "Sunday - Saturday",
      time: "06AM - 09PM",
    },
    sunday: {
      days: "Saturday",
      time: "10AM - 2PM",
    },
  },

  newsletter: {
    title: "Newsletter",
    description: "If you want to send us feedback, yes you can.",
    placeholder: "Write Feedback",
  },

  feedbackModal: {
    title: "Write Feedback",
    loginMessage: "Please login first to submit feedback.",
    placeholder: "Write 5 to 20 words",
    validationMessage: "Feedback must be between 5 and 20 words.",
    cancelButton: "Cancel",
    submitButton: "Submit",
    loginButton: "Login",
  },

  copyright: {
    website: "plateshare.com.np",
    designedBy: "clawbitlabs",
    designedByUrl: "https://clawbitlabs.com",
  },

  footerMenu: [
    { name: "Home", url: "/" },
    { name: "Cookies", url: "/cookies" },
    { name: "Help", url: "/help" },
    { name: "FQAs", url: "/faqs" },
  ],
};

module.exports = footerData;
