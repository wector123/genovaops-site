/* ============================================================
   GenovaOps | main.js
   Vanilla JS. No framework, no dependencies.
   - Loss map canvas (signature viz : lignes bleues formant une skyline)
   - Mobile nav toggle
   - FAQ accordion
   - Loss estimator (temps + argent perdus)
   - Lightbox
   - Reveal on scroll
   - FR/EN language switch
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Language switch ---------- */
  function setLang(lang) {
    if (!document.querySelector("[data-lang]")) return; // pages sans version anglaise
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang") !== lang;
    });
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", active);
      btn.classList.toggle("is-active", active);
    });
    document.querySelectorAll("option[data-fr]").forEach(function (opt) {
      opt.textContent = opt.getAttribute("data-" + lang) || opt.textContent;
    });
    var closeV = document.querySelector("[data-video-close]");
    if (closeV) closeV.setAttribute("aria-label", lang === "en" ? "Close the video" : "Fermer la vidéo");
    var closeL = document.querySelector("[data-lightbox-close]");
    if (closeL) closeL.setAttribute("aria-label", lang === "en" ? "Close" : "Fermer");
    try { localStorage.setItem("genovaops-lang", lang); } catch (e) {}
  }
  var savedLang = "fr";
  try { savedLang = localStorage.getItem("genovaops-lang") || "fr"; } catch (e) {}
  setLang(savedLang);
  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang-btn")); });
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navLinks = document.querySelector(".nav__links");
  if (navToggle && navLinks) {
    var setNav = function (open) {
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    navToggle.addEventListener("click", function () {
      setNav(!navLinks.classList.contains("is-open"));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) setNav(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll("[data-faq]").forEach(function (item) {
    var btn = item.querySelector(".faq-item__btn");
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll("[data-faq]").forEach(function (other) {
        other.classList.remove("is-open");
        var b = other.querySelector(".faq-item__btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Loss estimator ---------- */
  var estBtn = document.querySelector("[data-est-calc]");
  if (estBtn) {
    var estError = document.querySelector("[data-est-error]");
    var detail = {
      fr: document.querySelector('[data-est-detail][data-lang="fr"]'),
      en: document.querySelector('[data-est-detail][data-lang="en"]')
    };
    var readField = function (name) {
      var el = document.querySelector('[data-est-field="' + name + '"]');
      var v = el ? parseFloat(String(el.value || "").replace(",", ".")) : NaN;
      return isNaN(v) ? 0 : v;
    };
    var calc = function () {
      var requests = readField("requests");
      var minutes = readField("minutes");
      var rate = readField("rate");
      var missed = Math.min(Math.max(readField("missed"), 0), 100);

      if (requests <= 0 || minutes <= 0 || rate <= 0) {
        if (estError) estError.hidden = false;
        return;
      }
      if (estError) estError.hidden = true;

      var hoursYear = (requests * minutes / 60) * 46; // 46 semaines travaillées
      var moneyYear = hoursYear * rate;
      var days = Math.round(hoursYear / 7);            // journées de 7 h
      var forgotten = Math.round(requests * 46 * missed / 100);

      animateNumber(document.getElementById("estHours"), Math.round(hoursYear));
      animateNumber(document.getElementById("estMoney"), Math.round(moneyYear));
      animateNumber(document.getElementById("estMoneyEn"), Math.round(moneyYear));

      var fr = "Soit " + days.toLocaleString("fr-FR") + " journées de travail par an passées sur ces tâches.";
      var en = "That's " + days.toLocaleString("en-US") + " workdays a year spent on these tasks.";
      if (forgotten > 0) {
        fr += " Environ " + forgotten.toLocaleString("fr-FR") + " demandes oubliées par an.";
        en += " About " + forgotten.toLocaleString("en-US") + " forgotten requests a year.";
      }
      if (detail.fr) detail.fr.textContent = fr;
      if (detail.en) detail.en.textContent = en;
    };
    estBtn.addEventListener("click", calc);
    var estForm = document.querySelector("[data-est-form]");
    if (estForm) estForm.addEventListener("submit", function (e) { e.preventDefault(); calc(); });
  }

  /* ---------- Formulaire de contact (Formspree) ---------- */
  var cForm = document.querySelector("[data-contact-form]");
  if (cForm) {
    var cStatus = cForm.querySelector("[data-form-status]");
    var cBtn = cForm.querySelector('button[type="submit"]');
    var msgs = {
      fr: {
        ok: "Merci, votre message est bien parti. On vous répond sous 24 h ouvrées.",
        ko: "Le message n'a pas pu partir. Écrivez-nous directement à achille@genovaops.com ou sur WhatsApp.",
        todo: "Le formulaire n'est pas encore branché. Écrivez-nous à achille@genovaops.com ou sur WhatsApp."
      },
      en: {
        ok: "Thank you, your message has been sent. We'll reply within 24 business hours.",
        ko: "The message couldn't be sent. Please write to us directly at achille@genovaops.com or on WhatsApp.",
        todo: "The form isn't connected yet. Please write to us at achille@genovaops.com or on WhatsApp."
      }
    };
    var show = function (key, isError) {
      var lang = document.documentElement.lang === "en" ? "en" : "fr";
      cStatus.textContent = msgs[lang][key];
      cStatus.classList.toggle("is-error", !!isError);
      cStatus.hidden = false;
    };
    cForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cForm.action.indexOf("FORM_ID") !== -1) { show("todo", true); return; }
      if (cBtn) cBtn.disabled = true;
      fetch(cForm.action, {
        method: "POST",
        body: new FormData(cForm),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) { cForm.reset(); show("ok", false); }
        else { show("ko", true); }
      }).catch(function () {
        show("ko", true);
      }).then(function () {
        if (cBtn) cBtn.disabled = false;
      });
    });
  }

  function animateNumber(el, target) {
    if (!el) return;
    var start = 0, dur = 900, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(start + (target - start) * eased);
      el.textContent = val.toLocaleString("fr-FR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector("[data-lightbox]");
  var lbImg = document.querySelector("[data-lightbox-img]");
  document.querySelectorAll("[data-lightbox-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-lightbox-src");
      if (!src || !lb || !lbImg) return;
      lbImg.src = src;
      lbImg.alt = btn.getAttribute("aria-label") || "";
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
    });
  });
  if (lb) {
    var close = lb.querySelector("[data-lightbox-close]");
    if (close) close.addEventListener("click", function () {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) {
        lb.classList.remove("is-open");
        lb.setAttribute("aria-hidden", "true");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("is-open")) {
        lb.classList.remove("is-open");
        lb.setAttribute("aria-hidden", "true");
      }
    });
  }


  /* ---------- Year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Vidéo intégrée : bouton lecture central ---------- */
  var inlineVideo = document.querySelector(".video-frame video");
  var inlinePlay = document.querySelector("[data-video-play]");
  if (inlineVideo && inlinePlay) {
    inlinePlay.addEventListener("click", function () { inlineVideo.play(); });
    inlineVideo.addEventListener("play", function () { inlinePlay.hidden = true; });
    inlineVideo.addEventListener("pause", function () { if (!inlineVideo.ended) inlinePlay.hidden = false; });
    inlineVideo.addEventListener("ended", function () { inlinePlay.hidden = false; });
  }

  /* ---------- Video modal ---------- */
  var vModal = document.querySelector("[data-video-modal]");
  var vIframe = document.querySelector("[data-video-iframe]");
  var vClose = document.querySelector("[data-video-close]");
  var lastFocus = null;
  document.querySelectorAll("[data-video-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-video-id");
      var idEn = btn.getAttribute("data-video-id-en");
      if (idEn && document.documentElement.lang === "en") id = idEn;
      if (!id || !vModal || !vIframe) return;
      lastFocus = btn;
      vIframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      vModal.classList.add("is-open");
      vModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
  function closeVideo() {
    if (!vModal || !vIframe) return;
    vIframe.src = "";
    vModal.classList.remove("is-open");
    vModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (vClose) vClose.addEventListener("click", closeVideo);
  if (vModal) vModal.addEventListener("click", function (e) { if (e.target === vModal) closeVideo(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && vModal && vModal.classList.contains("is-open")) closeVideo();
  });
})();
