// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
let isMenuOpen = false;

mobileMenuButton.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
    menuIcon.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
  } else {
    mobileMenu.style.maxHeight = "0px";
    menuIcon.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
  }
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !mobileMenuButton.contains(e.target) &&
    !mobileMenu.contains(e.target) &&
    isMenuOpen
  ) {
    isMenuOpen = false;
    mobileMenu.style.maxHeight = "0px";
    mobileMenuButton.innerHTML =
      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  }
});

// Navbar scroll effect
let lastScrollY = window.scrollY;
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }
  lastScrollY = window.scrollY;
});
