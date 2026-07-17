// Minimal i18n router script. Synchronizes language preference and handles redirection.
(function () {
  "use strict";

  var STORAGE_KEY = "tcv-lang";
  var path = window.location.pathname;

  // Read current preference
  var saved = localStorage.getItem(STORAGE_KEY);
  
  // If no preference is saved, detect from browser settings
  var preferredEs = saved === "es" || (!saved && navigator.language && navigator.language.toLowerCase().indexOf("es") === 0);

  // If preference is Spanish and they are on the English root, redirect to /es/
  if (preferredEs && (path === "/" || path === "/index.html")) {
    window.location.replace("/es/");
  }
})();
