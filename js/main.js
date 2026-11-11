const sections = [...document.querySelectorAll("#landing, .holomem")];

let scrollDistance = 0;
let scrollLocked = false;
let resetTimer;

const SCROLL_THRESHOLD = window.innerHeight * 0.5;
const SCROLL_LOCK_DURATION = 1000;

function getCurrentSection() {
  const viewportCenter = window.scrollY + window.innerHeight / 2;

  return sections.reduce(
    (closest, section, index) => {
      const distance = Math.abs(
        section.offsetTop + section.offsetHeight / 2 - viewportCenter,
      );

      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: 0, distance: Infinity },
  ).index;
}

function navigateSection(direction) {
  const currentIndex = getCurrentSection();
  const nextIndex = Math.max(
    0,
    Math.min(currentIndex + direction, sections.length - 1),
  );

  if (nextIndex === currentIndex) return;

  scrollLocked = true;

  sections[nextIndex].scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  setTimeout(() => {
    scrollLocked = false;
  }, SCROLL_LOCK_DURATION);
}

window.addEventListener(
  "wheel",
  (event) => {
    // Ignore horizontal carousel interactions.
    if (event.target.closest(".holomem__slides")) return;

    if (scrollLocked) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    scrollDistance += event.deltaY;

    clearTimeout(resetTimer);

    if (Math.abs(scrollDistance) >= SCROLL_THRESHOLD) {
      navigateSection(scrollDistance > 0 ? 1 : -1);
      scrollDistance = 0;
      return;
    }

    resetTimer = setTimeout(() => {
      scrollDistance = 0;
    }, 180);
  },
  { passive: false },
);
