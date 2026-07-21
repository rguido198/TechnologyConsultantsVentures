(function() {
  var saved = localStorage.getItem("tcv-lang");
  var isEs = saved === "es" || (!saved && navigator.language && navigator.language.toLowerCase().indexOf("es") === 0);
  if (isEs && window.location.pathname === "/") {
    window.location.replace("/es/");
  }
})();
