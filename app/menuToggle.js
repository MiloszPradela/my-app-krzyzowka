document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");

  menuToggle.addEventListener("click", () => {
    mobileMenu.style.left = "0";
  });

  menuClose.addEventListener("click", () => {
    mobileMenu.style.left = "-100%";
  });
});
