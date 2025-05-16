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

  document.querySelectorAll('.viewBtn').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = button.getAttribute('data-price');
      const calories = button.getAttribute('data-calories');
      const imgSrc = button.getAttribute('data-img');

      document.getElementById('productModalLabel').textContent = name;
      document.getElementById('modalPrice').textContent = price;
      document.getElementById('modalCalories').textContent = `Calories: ${calories}`;
      document.getElementById('modalImage').src = imgSrc;

      const modal = new bootstrap.Modal(document.getElementById('productModal'));
      modal.show();
    });
  });
