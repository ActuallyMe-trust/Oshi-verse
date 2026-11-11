/* Holomem Slide Navigation */

document.querySelectorAll(".holomem").forEach((member) => {
  const carousel = member.querySelector(".holomem__slides");

  if (!carousel) return;

  const previousButton = member.querySelector("[data-carousel-prev]");
  const nextButton = member.querySelector("[data-carousel-next]");

  const currentDisplay = member.querySelector(".holomem__pagination-current");

  const totalDisplay = member.querySelector(".holomem__pagination-total");

  const titleDisplay = member.querySelector(".holomem__slide-title");

  const categoryDisplay = member.querySelector(".holomem__slide-category");

  const progressFill = member.querySelector(".holomem__progress-fill");

  const slides = [...carousel.querySelectorAll(".holomem__slide")];
  const totalSlides = slides.length;

  if (!totalSlides) return;

  let activeIndex = 0;
  let scrollTimeout;

  /* Update Interface */

  function updateInterface(index) {
    activeIndex = Math.max(0, Math.min(index, totalSlides - 1));

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === activeIndex);
    });

    const currentSlide = slides[activeIndex];

    if (currentDisplay) {
      currentDisplay.textContent = String(activeIndex + 1).padStart(2, "0");
    }

    if (totalDisplay) {
      totalDisplay.textContent = String(totalSlides).padStart(2, "0");
    }

    if (titleDisplay) {
      titleDisplay.textContent = currentSlide.dataset.title || "";
    }

    if (categoryDisplay) {
      categoryDisplay.textContent = currentSlide.dataset.category || "";
    }

    if (progressFill) {
      progressFill.style.width = `${((activeIndex + 1) / totalSlides) * 100}%`;
    }

    /* Disable Navigation at Boundaries */

    if (previousButton) {
      previousButton.disabled = activeIndex === 0;
    }

    if (nextButton) {
      nextButton.disabled = activeIndex === totalSlides - 1;
    }
  }

  /* Navigate to Slide */

  function goToSlide(index) {
    const targetIndex = Math.max(0, Math.min(index, totalSlides - 1));

    if (targetIndex === activeIndex) return;

    const targetSlide = slides[targetIndex];

    if (!targetSlide) return;

    updateInterface(targetIndex);

    carousel.scrollTo({
      left: targetSlide.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  /* Navigation Events */

  previousButton?.addEventListener("click", () => {
    goToSlide(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goToSlide(activeIndex + 1);
  });

  /* Detect Active Slide */

  function getClosestSlideIndex() {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - slideCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  /* Handle Swipe and Scroll */

  function handleScrollEnd() {
    const closestIndex = getClosestSlideIndex();
    updateInterface(closestIndex);
  }

  carousel.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(handleScrollEnd, 140);
  });

  if ("onscrollend" in carousel) {
    carousel.addEventListener("scrollend", handleScrollEnd);
  }

  /* Resize Alignment */

  window.addEventListener("resize", () => {
    const targetSlide = slides[activeIndex];

    carousel.scrollTo({
      left: targetSlide.offsetLeft,
      behavior: "auto",
    });
  });

  /* Initialize */

  updateInterface(0);

  carousel.scrollLeft = 0;
});
