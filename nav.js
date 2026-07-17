// Mobile navigation toggle logic.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".nav");
    var toggleBtn = document.querySelector("[data-nav-toggle]");
    var navLinks = document.querySelectorAll(".nav-links a");

    if (toggleBtn && nav) {
      toggleBtn.addEventListener("click", function () {
        var isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        nav.classList.toggle("nav-open");
        toggleBtn.setAttribute("aria-expanded", !isExpanded);
        
        // Prevent body scroll when menu is open
        if (!isExpanded) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      });

      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("nav-open");
          toggleBtn.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  });
})();
