document.querySelectorAll(".footer-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const menu = button.closest(".footer-menu");
    const isOpen = menu.classList.toggle("is-open");

    button.setAttribute("aria-expanded", String(isOpen));
  });
});