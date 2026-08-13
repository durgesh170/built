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

  /* Project detail media carousel (images + videos) */
  const detail = document.querySelector("[data-project-detail]");
  if (detail) {
    const slides = Array.from(detail.querySelectorAll(".detail-slide"));
    const dotsWrap = detail.querySelector("[data-detail-dots]");
    const caption = detail.querySelector("[data-detail-caption]");
    let index = slides.findIndex((s) => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    const activateFrame = (slide, on) => {
      const frame = slide.querySelector("iframe");
      if (!frame) return;
      const src = frame.getAttribute("data-src") || frame.getAttribute("src");
      if (!src) return;
      frame.setAttribute("data-src", src);
      if (on) {
        if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
      } else if (frame.getAttribute("src")) {
        frame.removeAttribute("src");
      }
    };

    const renderDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", `Go to media ${i + 1}`);
        if (i === index) btn.classList.add("is-active");
        btn.addEventListener("click", () => go(i));
        dotsWrap.appendChild(btn);
      });
    };

    const go = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const on = i === index;
        slide.classList.toggle("is-active", on);
        activateFrame(slide, on);
      });
      if (caption) {
        const label = slides[index]?.dataset.label || `Media ${index + 1}`;
        caption.textContent = `${label} · ${index + 1} / ${slides.length}`;
      }
      renderDots();
    };

    detail.querySelectorAll("[data-detail-prev]").forEach((btn) => {
      btn.addEventListener("click", () => go(index - 1));
    });
    detail.querySelectorAll("[data-detail-next]").forEach((btn) => {
      btn.addEventListener("click", () => go(index + 1));
    });

    document.addEventListener("keydown", (e) => {
      if (!detail.offsetParent) return;
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    go(index);
  }
})();
