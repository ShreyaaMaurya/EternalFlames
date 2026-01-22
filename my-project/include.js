document.addEventListener("DOMContentLoaded", async () => {
  // Load header
  const headerEl = document.getElementById("header");
  if (headerEl) {
    const res = await fetch("/template/header.html");
    const html = await res.text();
    headerEl.innerHTML = html;
    
    // Initialize mobile menu after header is loaded
    initMobileMenu();
  }

  // Load footer
  const footerEl = document.getElementById("footer");
  if (footerEl) {
    const res = await fetch("/template/footer.html");
    const html = await res.text();
    footerEl.innerHTML = html;
  }

  setTimeout(initUserUI, 500);
});

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    // Toggle menu on hamburger click
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    });

    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}



function initUserUI() {
  const token = localStorage.getItem("token");
  const loginLink = document.getElementById("loginLink");
  const profileActions = document.getElementById("profileActions");


  if (!profileActions) return;

  if (token) {
    if (loginLink) loginLink.style.display = "none";

    profileActions.innerHTML = `
      <div class="flex items-center space-x-4">
      <a href="/template/profile.html" class="flex items-center text-black hover:text-blue-600 transition ml-2">Profile
        </a>
        <a href="/template/cart.html" class="flex items-center text-black hover:text-blue-600 transition">
          🛒 <span class="ml-1">Bag</span>
        </a>
        <button id="logoutBtn" class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    `;

    // handle logout button click
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token"); // remove token
      window.location.href = "/template/login.html"; // redirect to login
    });
  }
}
