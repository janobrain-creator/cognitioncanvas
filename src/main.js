// Highlight the nav link for the section in view.
const nav = document.querySelector('.nav');
const navLinks = Array.from(nav.querySelectorAll('a'));
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href')));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = sections.indexOf(entry.target);
      navLinks.forEach((a, j) => a.classList.toggle('active', i === j));
      // Scroll only the nav strip; scrollIntoView would interrupt page scrolling.
      const link = navLinks[i];
      if (nav.scrollWidth > nav.clientWidth) {
        nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => observer.observe(s));
