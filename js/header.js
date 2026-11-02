(() => {
  const header = document.querySelector("header");

  if (!header) return;

  const dropdown = header.querySelector(".nav-dropdown");
  const trigger = header.querySelector(".nav-trigger");
  const submenu = header.querySelector(".nav-submenu");

  const menuButton = header.querySelector(".menu-btn");
  const mobileMenu = header.querySelector(".mobile-menu");

  const mobileSize = window.matchMedia("(max-width: 1150px)");
  const hoverDevice = window.matchMedia("(hover: hover)");

  function setDropdown(open) {
    if (!trigger || !submenu) return;

    trigger.setAttribute("aria-expanded", String(open));
    submenu.hidden = !open;
  }

  function setMobileMenu(open) {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "메뉴 닫기" : "메뉴 열기"
    );

    mobileMenu.hidden = !open;
  }

  // PC: 버튼 클릭
  trigger?.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    setDropdown(!isOpen);
  });

  // PC: 마우스를 올리면 열기
  dropdown?.addEventListener("mouseenter", () => {
    if (!mobileSize.matches && hoverDevice.matches) {
      setDropdown(true);
    }
  });

  // 마우스와 키보드 포커스가 모두 빠져나가면 닫기
  dropdown?.addEventListener("mouseleave", () => {
    if (!dropdown.contains(document.activeElement)) {
      setDropdown(false);
    }
  });

  dropdown?.addEventListener("focusout", (event) => {
    if (!dropdown.contains(event.relatedTarget)) {
      setDropdown(false);
    }
  });

  // 모바일: 햄버거 클릭
  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMobileMenu(!isOpen);
  });

  // 메뉴 밖 클릭
  document.addEventListener("click", (event) => {
    if (!dropdown?.contains(event.target)) {
      setDropdown(false);
    }

    if (
      !menuButton?.contains(event.target) &&
      !mobileMenu?.contains(event.target)
    ) {
      setMobileMenu(false);
    }
  });

  // Esc로 닫고 해당 버튼으로 포커스 이동
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (menuButton?.getAttribute("aria-expanded") === "true") {
      setMobileMenu(false);
      menuButton.focus();
    }

    if (trigger?.getAttribute("aria-expanded") === "true") {
      setDropdown(false);
      trigger.focus();
    }
  });

  // 화면 크기 전환 시 열린 메뉴 정리
  mobileSize.addEventListener("change", () => {
    setDropdown(false);
    setMobileMenu(false);
  });

  // 모바일 메뉴에서 링크 선택 시 닫기
  mobileMenu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMobileMenu(false);
    }
  });
})();