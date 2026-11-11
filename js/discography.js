/* Discography Marquee */

document.addEventListener("DOMContentLoaded", () => {
  const discographies = document.querySelectorAll("[data-discography]");

  discographies.forEach((discography) => {
    const viewport = discography.querySelector("[data-discography-viewport]");

    const track = discography.querySelector("[data-discography-track]");

    const groups = Array.from(
      track?.querySelectorAll(":scope > .discography__group") || [],
    );

    if (!viewport || !track || groups.length < 2) {
      return;
    }

    /* Original Album Sequence */

    const originalGroup = groups[0];

    const albums = Array.from(originalGroup.querySelectorAll("[data-album]"));

    if (albums.length === 0) {
      return;
    }

    /* Duplicate Sequence Accessibility */

    const duplicateGroup = groups[1];

    duplicateGroup.setAttribute("aria-hidden", "true");

    duplicateGroup
      .querySelectorAll("a, button, input, select, textarea")
      .forEach((element) => {
        element.setAttribute("tabindex", "-1");
      });

    /* Album Counter */

    const totalCounter = discography.querySelector("[data-discography-total]");

    if (totalCounter) {
      totalCounter.textContent = String(albums.length).padStart(2, "0");
    }

    /* Marquee Speed */

    const speed = Number(discography.dataset.speed) || 32;

    discography.style.setProperty("--discography-speed", `${speed}s`);
  });
});
