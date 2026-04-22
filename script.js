/* ============================================================
   SKY CAKE — script.js
   All interactive functionality:
   1.  Custom cursor
   2.  Magic intro (first visit only)
   3.  Navbar scroll + active link (Intersection Observer)
   4.  Parallax hero background
   5.  Mobile nav (hamburger)
   6.  Category tabs
   7.  Gallery lightbox
   8.  Order form → WhatsApp message
   9.  Language switcher (AZ / RU / EN)
   10. Scroll reveal animations
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   ──────────────────────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");

  // Only on non-touch devices
  if (!cursor || !follower || window.matchMedia("(pointer: coarse)").matches)
    return;

  let mouseX = 0,
    mouseY = 0;
  let followerX = 0,
    followerY = 0;

  // Track main cursor position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  // Smooth follower animation
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .hex-item, .cat-menu-item, .contact-link-item, .delivery-card, .form-input, .form-select, .form-textarea",
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor--hover");
      follower.classList.add("cursor--hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor--hover");
      follower.classList.remove("cursor--hover");
    });
  });
})();

/* ────────────────────────────────────────────────────────────
   2. MAGIC INTRO — only on first visit using localStorage
   ──────────────────────────────────────────────────────────── */
(function initMagicIntro() {
  const intro = document.getElementById("magic-intro");
  if (!intro) return;

  // Check if already visited
  const visited = localStorage.getItem("skycake_visited");

  if (visited) {
    // Already visited — hide intro immediately
    intro.classList.add("hidden");
    return;
  }

  // First visit — show intro with magic sparkles
  generateSparkles();
  playMagicSound();

  // Mark as visited
  localStorage.setItem("skycake_visited", "true");

  // Auto-hide after 2.8 seconds
  setTimeout(() => {
    intro.classList.add("hidden");
  }, 2800);

  // Generate sparkle particles
  function generateSparkles() {
    const container = document.getElementById("magic-sparkles");
    if (!container) return;

    const colors = ["#D4AF8C", "#E8B4B8", "#C8849A", "#FDF6F0", "#FFD700"];
    const count = 40;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle");

      // Random position from center
      const tx = (Math.random() - 0.5) * 600 + "px";
      const ty = (Math.random() - 0.5) * 600 + "px";
      const size = Math.random() * 10 + 4;
      const delay = Math.random() * 0.8;

      sparkle.style.cssText = `
        left: 50%;
        top: 50%;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --tx: ${tx};
        --ty: ${ty};
        animation-delay: ${delay}s;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      `;

      container.appendChild(sparkle);
    }
  }

  // Play a soft magic chime using Web Audio API (no external file needed)
  function playMagicSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();

      // Fairy dust chord: ascending notes
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gainNode.gain.linearRampToValueAtTime(
          0.18,
          ctx.currentTime + i * 0.12 + 0.05,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.12 + 0.7,
        );

        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.8);
      });
    } catch (e) {
      // Audio not supported — silent, no problem
    }
  }
})();

/* ────────────────────────────────────────────────────────────
   3. NAVBAR — scroll state + active section highlight
   ──────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  // Scroll state: add/remove .scrolled class
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // Run once on load

  // Active link via Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "-40% 0px -55% 0px", // Triggers when section is ~centered in viewport
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        // Remove active from all
        navLinks.forEach((link) => link.classList.remove("active"));

        // Add active to matching link
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));
})();

/* ────────────────────────────────────────────────────────────
   4. PARALLAX — Hero background on scroll
   ──────────────────────────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.getElementById("hero-bg");
  if (!heroBg) return;

  // Disable on mobile for performance
  if (window.matchMedia("(max-width: 768px)").matches) return;

  function onScroll() {
    const scrollY = window.scrollY;
    const speed = 0.35; // Lower = more subtle parallax
    heroBg.style.transform = `scale(1.1) translateY(${scrollY * speed}px)`;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ────────────────────────────────────────────────────────────
   5. MOBILE NAV — Hamburger toggle
   ──────────────────────────────────────────────────────────── */
(function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open");
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileNav.classList.contains("open")
      ? "hidden"
      : "";
  });
})();

// Exposed globally for onclick in HTML
function closeMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  if (hamburger) hamburger.classList.remove("open");
  if (mobileNav) mobileNav.classList.remove("open");
  document.body.style.overflow = "";
}

/* ────────────────────────────────────────────────────────────
   6. CATEGORY TABS
   ──────────────────────────────────────────────────────────── */
(function initCategoryTabs() {
  const menuItems = document.querySelectorAll(".cat-menu-item");
  const panels = document.querySelectorAll(".cat-panel");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");

      // Remove active from all menu items
      menuItems.forEach((mi) => mi.classList.remove("active"));
      // Remove active from all panels
      panels.forEach((p) => p.classList.remove("active"));

      // Activate clicked
      item.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });
})();

/* ────────────────────────────────────────────────────────────
   7. GALLERY LIGHTBOX
   ──────────────────────────────────────────────────────────── */
(function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const hexItems = document.querySelectorAll(".hex-item");

  if (!lightbox || !lightboxImg) return;

  // Collect all image sources
  const images = Array.from(hexItems).map((item) =>
    item.getAttribute("data-img"),
  );
  let currentIndex = 0;

  // Open lightbox
  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    // Small delay before clearing src (prevents flicker)
    setTimeout(() => {
      lightboxImg.src = "";
    }, 400);
  }

  // Navigate to previous/next
  function goTo(index) {
    currentIndex = (index + images.length) % images.length;
    // Fade out → change → fade in
    lightboxImg.style.opacity = "0";
    setTimeout(() => {
      lightboxImg.src = images[currentIndex];
      lightboxImg.style.opacity = "1";
    }, 180);
  }

  lightboxImg.style.transition = "opacity 0.18s ease";

  // Attach click events to hex items
  hexItems.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
  });

  // Close events
  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(currentIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goTo(currentIndex - 1);
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  lightbox.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0)
        goTo(currentIndex + 1); // Swipe left → next
      else goTo(currentIndex - 1); // Swipe right → prev
    }
  });
})();

/* ────────────────────────────────────────────────────────────
   8. ORDER FORM → WhatsApp message
   ──────────────────────────────────────────────────────────── */
(function initOrderForm() {
  const submitBtn = document.getElementById("form-submit");
  if (!submitBtn) return;

  const WHATSAPP_NUMBER = "994706403464"; // Without + sign

  submitBtn.addEventListener("click", () => {
    // Get form values
    const name = document.getElementById("f-name")?.value.trim() || "";
    const surname = document.getElementById("f-surname")?.value.trim() || "";
    const phone = document.getElementById("f-phone")?.value.trim() || "";
    const date = document.getElementById("f-date")?.value || "";
    const time = document.getElementById("f-time")?.value || "";
    const typeEl = document.getElementById("f-type");
    const type = typeEl ? typeEl.options[typeEl.selectedIndex]?.text || "" : "";
    const note = document.getElementById("f-note")?.value.trim() || "";

    // Validation — required fields
    if (
      !name ||
      !phone ||
      !date ||
      !type ||
      type === "Seçin..." ||
      type === "Выберите..." ||
      type === "Select..."
    ) {
      // Highlight empty required fields
      if (!name) document.getElementById("f-name")?.classList.add("error");
      if (!phone) document.getElementById("f-phone")?.classList.add("error");
      if (!date) document.getElementById("f-date")?.classList.add("error");

      // Show brief shake animation on button
      submitBtn.style.animation = "none";
      submitBtn.offsetHeight; // Reflow
      submitBtn.style.animation = "shake 0.4s ease";

      setTimeout(() => {
        document
          .querySelectorAll(".form-input.error, .form-select.error")
          .forEach((el) => el.classList.remove("error"));
      }, 2500);

      return;
    }

    // Get current language
    const lang = document.documentElement.lang || "az";

    // Format date nicely
    let formattedDate = date;
    if (date) {
      try {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString(
          lang === "az" ? "az-AZ" : lang === "ru" ? "ru-RU" : "en-GB",
          { day: "numeric", month: "long", year: "numeric" },
        );
      } catch (e) {
        /* keep original */
      }
    }

    // Build multilingual message
    const messages = {
      az: `Salam Səma xanım! 🎂\n\nSifariş vermək istəyirəm:\n\n👤 Ad Soyad: ${name} ${surname}\n📞 Telefon: ${phone}\n🎂 Sifariş növü: ${type}\n📅 Tarix: ${formattedDate}${time ? "\n⏰ Saat: " + time : ""}${note ? "\n📝 Qeyd: " + note : ""}\n\nCavabınızı gözləyirəm. Təşəkkür edirəm!`,
      ru: `Добрый день, Сэма! 🎂\n\nХочу сделать заказ:\n\n👤 Имя Фамилия: ${name} ${surname}\n📞 Телефон: ${phone}\n🎂 Тип заказа: ${type}\n📅 Дата: ${formattedDate}${time ? "\n⏰ Время: " + time : ""}${note ? "\n📝 Примечание: " + note : ""}\n\nЖду вашего ответа. Спасибо!`,
      en: `Hello Səma! 🎂\n\nI'd like to place an order:\n\n👤 Full Name: ${name} ${surname}\n📞 Phone: ${phone}\n🎂 Order Type: ${type}\n📅 Date: ${formattedDate}${time ? "\n⏰ Time: " + time : ""}${note ? "\n📝 Note: " + note : ""}\n\nLooking forward to your reply. Thank you!`,
    };

    const message = messages[lang] || messages["az"];
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    window.open(waUrl, "_blank");
  });

  // Remove error class on input
  document.querySelectorAll(".form-input, .form-select").forEach((el) => {
    el.addEventListener("input", () => el.classList.remove("error"));
  });
})();

// Shake animation style (injected)
(function injectShakeStyle() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
    .form-input.error, .form-select.error {
      border-color: #E07070 !important;
      box-shadow: 0 0 0 3px rgba(224, 112, 112, 0.15) !important;
    }
  `;
  document.head.appendChild(style);
})();

/* ────────────────────────────────────────────────────────────
   9. LANGUAGE SWITCHER
   AZ / RU / EN — updates all data-az/ru/en elements
   ──────────────────────────────────────────────────────────── */
(function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll(".lang-btn");
  let currentLang = localStorage.getItem("skycake_lang") || "az";

  // Apply language on load
  applyLanguage(currentLang);

  // Click handlers on all lang buttons (desktop + mobile)
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLang = btn.getAttribute("data-lang");
      localStorage.setItem("skycake_lang", currentLang);
      applyLanguage(currentLang);
    });
  });

  function applyLanguage(lang) {
    // Set html lang attribute
    document.documentElement.lang = lang;

    // Update all lang buttons (active state)
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    // Update placeholders separately
    document
      .querySelectorAll("[data-placeholder-" + lang + "]")
      .forEach((el) => {
        el.placeholder = el.getAttribute("data-placeholder-" + lang);
      });
    // Update all elements with data-az/ru/en attributes (text content)
    document.querySelectorAll(`[data-${lang}]`).forEach((el) => {
      const value = el.getAttribute(`data-${lang}`);
      if (!value) return;

      // For input/textarea — update placeholder
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        const placeholder = el.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) el.placeholder = placeholder;
        return;
      }

      // For select options — update text
      if (el.tagName === "OPTION") {
        el.textContent = value;
        return;
      }

      // For all other elements — update text content
      el.textContent = value;
    });

    // Update select option texts (special handling for select)
    document.querySelectorAll("select option[data-az]").forEach((opt) => {
      const val = opt.getAttribute(`data-${lang}`);
      if (val) opt.textContent = val;
    });

    // Update page title
    const titles = {
      az: "Sky Cake — Əl işi tortlar · Səma",
      ru: "Sky Cake — Торты ручной работы · Сэма",
      en: "Sky Cake — Handcrafted Cakes · Səma",
    };
    document.title = titles[lang] || titles.az;
  }
})();

/* ────────────────────────────────────────────────────────────
   10. SCROLL REVEAL ANIMATIONS — Intersection Observer
   ──────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );
  if (!revealEls.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Unobserve after revealed — no need to watch anymore
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -80px 0px", // Trigger slightly before element is fully in view
      threshold: 0.1,
    },
  );

  revealEls.forEach((el) => revealObserver.observe(el));
})();

/* ────────────────────────────────────────────────────────────
   INIT — Run everything after DOM is fully loaded
   ──────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Ensure body is visible (prevent FOUC)
  document.body.style.visibility = "visible";

  console.log(
    "%c☁ Sky Cake %c— Handcrafted with love",
    "color:#C8849A;font-size:16px;font-weight:bold;",
    "color:#D4AF8C;font-size:12px;",
  );
});
