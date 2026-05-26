(function () {
    document.querySelectorAll(".countdown").forEach(function (element) {
        const expiryTime = new Date(element.getAttribute("data-expiry")).getTime();

        const updateCountdown = function () {
            const distance = expiryTime - Date.now();

            if (distance <= 0) {
                element.textContent = "Expired";
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.textContent = `${hours}h ${minutes}m ${seconds}s to Expire`;
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
    });

    document.querySelectorAll(".claim-food-form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            const message = form.dataset.confirmMessage;

            if (message && !window.confirm(message)) {
                event.preventDefault();
            }
        });
    });

    const map = document.getElementById("map");
    if (!map) return;

    const latitude = map.dataset.latitude;
    const longitude = map.dataset.longitude;

    if (latitude && longitude) {
        map.src = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
    }
})();
