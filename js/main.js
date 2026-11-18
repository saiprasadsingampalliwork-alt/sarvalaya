(function () {
  "use strict";

  var themeToggle = document.querySelector("[data-theme-toggle]");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var dark = theme === "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
      themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
    if (themeMeta) {
      themeMeta.setAttribute("content", dark ? "#2B0A0F" : "#F7F1E6");
    }
  }

  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("sarvalaya-theme", next);
      } catch (error) {}
    });
  }

  var newsletter = document.querySelector("[data-newsletter]");
  if (newsletter) {
    var status = newsletter.querySelector("[data-newsletter-status]");
    var input = newsletter.querySelector("input[type='email']");

    newsletter.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value.trim();
      input.value = value;

      if (!value || !input.checkValidity()) {
        status.textContent = "Please enter a valid email address.";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      input.removeAttribute("aria-invalid");
      status.textContent = "Thank you. Daily blessings will arrive at " + value + ".";
      newsletter.reset();
    });
  }

  var cartStatus = document.querySelector("[data-cart-status]");

  document.querySelectorAll("[data-add-cart]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.pending === "true") return;

      var name = button.getAttribute("data-add-cart");
      var label = button.getAttribute("aria-label");
      button.dataset.pending = "true";
      button.classList.add("is-added");
      button.setAttribute("aria-label", name + " added to cart");

      if (cartStatus) {
        cartStatus.textContent = name + " added to cart.";
      }

      window.setTimeout(function () {
        button.classList.remove("is-added");
        button.setAttribute("aria-label", label);
        button.dataset.pending = "false";
      }, 1400);
    });
  });

  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.matches || !("IntersectionObserver" in window)) {
    document.documentElement.classList.remove("motion");
    return;
  }

  document.querySelectorAll(".grid, .deity-grid, .trust-grid, .story-layout").forEach(function (group) {
    var index = 0;
    Array.prototype.forEach.call(group.children, function (child) {
      if (!child.matches(".card, .occasion, .material, .deity, .faq, .story-copy, .halo-portrait, li")) {
        return;
      }
      child.style.setProperty("--reveal-delay", index * 90 + "ms");
      index += 1;
    });
  });

  var targets = document.querySelectorAll(
    "main > section:not(.hero), .card, .occasion, .material, .deity, .trust-grid > li, .faq, .story-copy, .halo-portrait"
  );

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -32px 0px" });

  targets.forEach(function (el) {
    el.addEventListener("animationend", function (event) {
      if (event.target !== el) return;
      el.classList.add("is-shown");
    });
    observer.observe(el);
  });
})();
