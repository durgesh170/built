(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      mobileNav.classList.toggle("is-open");
      toggle.setAttribute(
        "aria-expanded",
        mobileNav.classList.contains("is-open") ? "true" : "false"
      );
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileNav.classList.remove("is-open"));
    });
  }

  const syncServiceIcons = () => {
    document.querySelectorAll(".service-item").forEach((item) => {
      const icon = item.querySelector(".service-icon svg path");
      const trigger = item.querySelector(".service-trigger");
      if (!icon || !trigger) return;
      const open = item.classList.contains("is-open");
      icon.setAttribute("d", open ? "M5 12h14" : "M12 5v14M5 12h14");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  };
  syncServiceIcons();

  document.querySelectorAll(".service-item").forEach((item) => {
    const trigger = item.querySelector(".service-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".service-item").forEach((el) => el.classList.remove("is-open"));
      if (!open) item.classList.add("is-open");
      syncServiceIcons();
    });
  });

  const tabs = document.querySelectorAll(".industry-tab");
  const panels = document.querySelectorAll(".industry-panel");
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      if (panels[index]) panels[index].classList.add("is-active");
    });
  });

  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();
      if (!name || !email || !message) {
        if (status) status.textContent = "Please fill in name, email and message.";
        return;
      }
      if (status) {
        status.textContent =
          "Thanks — this static demo doesn’t send mail. WhatsApp or email us instead.";
      }
      form.reset();
    });
  }

  /* Work page featured showcase */
  const showcase = document.querySelector("[data-showcase]");
  if (showcase) {
    const slides = Array.from(showcase.querySelectorAll(".showcase-slide"));
    const dotsWrap = showcase.querySelector("[data-showcase-dots]");
    let index = slides.findIndex((s) => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    const renderDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", `Go to project ${i + 1}`);
        if (i === index) btn.classList.add("is-active");
        btn.addEventListener("click", () => go(i));
        dotsWrap.appendChild(btn);
      });
    };

    const go = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      renderDots();
    };

    showcase.querySelectorAll("[data-showcase-prev]").forEach((btn) => {
      btn.addEventListener("click", () => go(index - 1));
    });
    showcase.querySelectorAll("[data-showcase-next]").forEach((btn) => {
      btn.addEventListener("click", () => go(index + 1));
    });

    document.addEventListener("keydown", (e) => {
      if (!showcase.offsetParent) return;
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    renderDots();
  }

  /* Project page multi-video carousel */
  const videoCarousel = document.querySelector("[data-video-carousel]");
  if (videoCarousel) {
    const slides = Array.from(videoCarousel.querySelectorAll(".video-carousel-slide"));
    const label = videoCarousel.querySelector("[data-video-label]");
    let index = 0;

    const sync = () => {
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      if (label) {
        const title = slides[index]?.dataset.label || `Video ${index + 1}`;
        label.textContent = `${title} · ${index + 1} / ${slides.length}`;
      }
      // Pause non-active Drive iframes by resetting src
      slides.forEach((slide, i) => {
        const frame = slide.querySelector("iframe");
        if (!frame) return;
        const src = frame.getAttribute("data-src") || frame.getAttribute("src");
        if (!src) return;
        frame.setAttribute("data-src", src);
        if (i === index) {
          if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
        } else if (frame.getAttribute("src")) {
          frame.removeAttribute("src");
        }
      });
    };

    videoCarousel.querySelectorAll("[data-video-prev]").forEach((btn) => {
      btn.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        sync();
      });
    });
    videoCarousel.querySelectorAll("[data-video-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        sync();
      });
    });

    sync();
  }
})();
