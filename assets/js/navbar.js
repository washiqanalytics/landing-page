/** @format */

function setupNavbarInteractions() {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileToggle.textContent = navLinks.classList.contains("active")
                ? "✕"
                : "☰";
        });
    }

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                dropdownMenu.classList.toggle("active");
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach((link) => {
        if (!link.classList.contains("dropdown-toggle")) {
            link.addEventListener("click", () => {
                if (navLinks && navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                    if (mobileToggle) mobileToggle.textContent = "☰";
                }
            });
        }
    });

    // Close mobile menu when clicking dropdown items
    document.querySelectorAll(".dropdown-menu a").forEach((link) => {
        link.addEventListener("click", () => {
            if (navLinks) {
                navLinks.classList.remove("active");
            }
            if (mobileToggle) {
                mobileToggle.textContent = "☰";
            }
            if (dropdownMenu) {
                dropdownMenu.classList.remove("active");
            }
        });
    });
}

async function loadNavbar() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Check if we are on index.html or root
    const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/index.html") ||
        window.location.pathname === "";

    if (isHomePage) {
        // Navbar is already there as per user's request
        setupNavbarInteractions();
    } else {
        try {
            // Fetch the navbar from index.html
            const response = await fetch("/index.html");
            if (!response.ok) throw new Error("Could not fetch index.html");

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const sourceNav = doc.querySelector("nav");

            if (sourceNav) {
                nav.innerHTML = sourceNav.innerHTML;
                setupNavbarInteractions();
            } else {
                console.error("No <nav> element found in index.html");
            }
        } catch (error) {
            console.error("Failed to load common navbar:", error);
            // Fallback: If fetch fails (e.g. local file system), try to initialize what's there
            setupNavbarInteractions();
        }
    }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
