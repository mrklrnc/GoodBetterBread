let lastScrollTop = 0;
const navbar = document.getElementById('mainNavbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling down
    navbar.style.top = "-100px"; // Hide
  } else {
    // Scrolling up
    navbar.style.top = "0"; // Show
  }

  lastScrollTop = scrollTop;
});
