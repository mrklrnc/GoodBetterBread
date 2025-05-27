document.addEventListener('DOMContentLoaded', function() {
  const personIcon = document.querySelector('img[alt="person"]');
  const loginModal = document.getElementById('loginModal');
  const loginClose = document.getElementById('loginClose');
  const loginForm = document.getElementById('loginForm');

  if (personIcon && loginModal && loginClose && loginForm) {
    personIcon.addEventListener('click', function() {
      loginModal.style.display = 'flex';
    });

    loginClose.addEventListener('click', function() {
      loginModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });

    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Login submitted!');
      loginModal.style.display = 'none';
    });
  }
}); 