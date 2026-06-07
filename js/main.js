gsap.registerPlugin(Observer, CustomEase);

gsap.config({ force3D: true });
gsap.ticker.lagSmoothing(0);

const EASE_SCROLL = CustomEase.create(
  "sectionScroll",
  "M0,0 C0.62,0 0.18,1 1,1"
);

const EASE_CONTENT_IN = CustomEase.create(
  "contentIn",
  "M0,0 C0.55,0 0.22,1 1,1"
);

const EASE_CONTENT_OUT = CustomEase.create(
  "contentOut",
  "M0,0 C0.7,0 0.35,0.6 1,1"
);

const SCROLL_DURATION = 1.15;
const TWEEN_DEFAULTS = { force3D: true, lazy: false };

const sections = gsap.utils.toArray(".section");
const track = document.querySelector(".scroll-track");
const navDots = gsap.utils.toArray(".nav-dot");
const progressCurrent = document.querySelector(".progress-current");
const scrollHint = document.querySelector(".scroll-hint");
const total = sections.length;

let currentIndex = 0;
let isAnimating = false;
let activeTimeline = null;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getTrackYPercent(index) {
  return -(index * 100) / total;
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function setAnimatingState(active) {
  document.body.classList.toggle("is-animating", active);
  track.classList.toggle("is-animating", active);
}

function setActiveSection(index) {
  currentIndex = index;
  progressCurrent.textContent = pad(index + 1);

  navDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  const theme = sections[index].dataset.theme || "dark";
  document.body.dataset.theme = theme;

  scrollHint.classList.toggle("hidden", index > 0);
}

function getSectionTargets(section) {
  return {
    eyebrow: section.querySelector(".eyebrow"),
    titleLines: section.querySelectorAll(".title .line, .quote-line"),
    desc: section.querySelector(".desc"),
    stats: section.querySelectorAll(".stat-num"),
    features: section.querySelectorAll(".feature-item"),
    cta: section.querySelector(".cta-btn"),
    orbs: section.querySelectorAll(".orb"),
    content: section.querySelector(".section-content"),
  };
}

function resetSection(section) {
  const t = getSectionTargets(section);
  const hidden = { ...TWEEN_DEFAULTS };

  if (t.eyebrow) gsap.set(t.eyebrow, { y: 20, autoAlpha: 0, ...hidden });
  if (t.titleLines.length) gsap.set(t.titleLines, { y: 60, autoAlpha: 0, ...hidden });
  if (t.desc) gsap.set(t.desc, { y: 30, autoAlpha: 0, ...hidden });
  if (t.features.length) gsap.set(t.features, { x: 40, autoAlpha: 0, ...hidden });
  if (t.cta) gsap.set(t.cta, { y: 30, autoAlpha: 0, scale: 0.95, ...hidden });
  if (t.orbs.length) gsap.set(t.orbs, { autoAlpha: 0, ...hidden });
  if (t.content && !t.titleLines.length) gsap.set(t.content, { y: 40, autoAlpha: 0, ...hidden });

  t.stats.forEach((stat) => {
    gsap.set(stat, { autoAlpha: 0, ...hidden });
    stat.textContent = "0";
  });
}

function animateCounter(stat, target, tl, position) {
  const counter = { val: 0 };
  let lastRendered = -1;

  tl.to(
    counter,
    {
      val: target,
      duration: 0.85,
      ease: EASE_CONTENT_IN,
      ...TWEEN_DEFAULTS,
      onUpdate: () => {
        const rounded = Math.round(counter.val);
        if (rounded !== lastRendered) {
          stat.textContent = rounded;
          lastRendered = rounded;
        }
      },
    },
    position
  );
}

function animateSectionIn(section, tl, startAt = 0.18) {
  const t = getSectionTargets(section);
  const opts = { ...TWEEN_DEFAULTS, ease: EASE_CONTENT_IN };

  if (t.orbs.length) {
    tl.to(t.orbs, { autoAlpha: 1, duration: 0.9, stagger: 0.06, ...opts }, startAt);
  }

  if (t.eyebrow) {
    tl.to(t.eyebrow, { y: 0, autoAlpha: 1, duration: 0.65, ...opts }, startAt + 0.05);
  }

  if (t.titleLines.length) {
    tl.to(
      t.titleLines,
      { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.07, ...opts },
      startAt + 0.1
    );
  }

  if (t.desc) {
    tl.to(t.desc, { y: 0, autoAlpha: 1, duration: 0.6, ...opts }, startAt + 0.28);
  }

  t.stats.forEach((stat, i) => {
    const target = parseInt(stat.dataset.count, 10);
    const offset = startAt + 0.22 + i * 0.04;

    tl.to(stat, { autoAlpha: 1, duration: 0.35, ...opts }, offset);
    animateCounter(stat, target, tl, offset + 0.05);
  });

  if (t.features.length) {
    tl.to(
      t.features,
      { x: 0, autoAlpha: 1, duration: 0.65, stagger: 0.08, ...opts },
      startAt + 0.2
    );
  }

  if (t.cta) {
    tl.to(t.cta, { y: 0, autoAlpha: 1, scale: 1, duration: 0.65, ...opts }, startAt + 0.38);
  }

  if (t.content && !t.titleLines.length) {
    tl.to(t.content, { y: 0, autoAlpha: 1, duration: 0.7, ...opts }, startAt + 0.1);
  }
}

function animateSectionOut(section, tl, direction = 1, startAt = 0) {
  const t = getSectionTargets(section);
  const drift = direction * -40;

  const targets = [
    t.eyebrow,
    ...t.titleLines,
    t.desc,
    ...t.features,
    t.cta,
    ...t.orbs,
    ...(t.content && !t.titleLines.length ? [t.content] : []),
  ].filter(Boolean);

  if (!targets.length) return;

  tl.to(
    targets,
    {
      y: `+=${drift}`,
      autoAlpha: 0,
      duration: 0.55,
      ease: EASE_CONTENT_OUT,
      stagger: 0.025,
      ...TWEEN_DEFAULTS,
    },
    startAt
  );
}

function goToSection(index) {
  index = gsap.utils.clamp(0, total - 1, index);

  if (index === currentIndex || isAnimating) return;

  const direction = index > currentIndex ? 1 : -1;
  const prevIndex = currentIndex;

  if (activeTimeline) activeTimeline.kill();

  isAnimating = true;
  setAnimatingState(true);
  setActiveSection(index);

  const tl = gsap.timeline({
    defaults: { ease: EASE_SCROLL, ...TWEEN_DEFAULTS },
    onComplete: () => {
      isAnimating = false;
      setAnimatingState(false);
      activeTimeline = null;
    },
  });

  activeTimeline = tl;

  animateSectionOut(sections[prevIndex], tl, direction, 0);

  tl.to(
    track,
    {
      yPercent: getTrackYPercent(index),
      duration: SCROLL_DURATION,
      ease: EASE_SCROLL,
    },
    0
  );

  animateSectionIn(sections[index], tl, 0.15);

  return tl;
}

function navigate(delta) {
  goToSection(currentIndex + delta);
}

function initObserver() {
  // Desktop wheel — scroll down = next, scroll up = previous
  Observer.create({
    target: window,
    type: "wheel",
    tolerance: 10,
    preventDefault: true,
    onDown: () => navigate(1),
    onUp: () => navigate(-1),
  });

  // Mobile touch — swipe up = next section, swipe down = previous (inverted vs wheel)
  Observer.create({
    target: window,
    type: "touch",
    tolerance: 40,
    preventDefault: true,
    onUp: () => navigate(1),
    onDown: () => navigate(-1),
  });
}

function initKeyboard() {
  window.addEventListener("keydown", (e) => {
    if (isAnimating) return;

    const downKeys = ["ArrowDown", "PageDown", " "];
    const upKeys = ["ArrowUp", "PageUp"];

    if (downKeys.includes(e.key)) {
      e.preventDefault();
      navigate(1);
    } else if (upKeys.includes(e.key)) {
      e.preventDefault();
      navigate(-1);
    }
  });
}

function initNavDots() {
  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSection(parseInt(dot.dataset.index, 10));
    });
  });
}

function initReducedMotion() {
  document.body.dataset.motion = "reduced";

  sections.forEach((section, i) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveSection(i);
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
  });
}

function init() {
  sections.forEach((section, i) => {
    if (i !== 0) resetSection(section);
  });

  setActiveSection(0);
  gsap.set(track, { yPercent: 0, force3D: true });

  if (prefersReducedMotion) {
    initReducedMotion();
    return;
  }

  const tl = gsap.timeline({ defaults: TWEEN_DEFAULTS });
  animateSectionIn(sections[0], tl, 0.3);
  initObserver();
  initKeyboard();
  initNavDots();
}

window.addEventListener("load", init);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    gsap.set(track, { yPercent: getTrackYPercent(currentIndex), force3D: true });
  }, 200);
});
