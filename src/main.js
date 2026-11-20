// Highlight the nav link for the section in view.
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href')));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = sections.indexOf(entry.target);
      navLinks.forEach((a, j) => a.classList.toggle('active', i === j));
      navLinks[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => observer.observe(s));
