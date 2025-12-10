const toggle = document.querySelector(".mobile-menu-icon");
const nav = document.querySelector(".nav");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});
