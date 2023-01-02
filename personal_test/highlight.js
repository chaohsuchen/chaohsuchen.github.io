// Select all the "mark" elements on the page
const markers = document.querySelectorAll('mark');

// Create an IntersectionObserver
const observer = new IntersectionObserver(entries => {
  // For each observed element
  entries.forEach((entry) => {
    // If the element is intersecting with the viewport
    if (entry.intersectionRatio > 0) {
      // Set the "animation-play-state" property to "running"
      // to start the animation
      entry.target.style.animationPlayState = 'running';
      
      // Stop observing the element
      observer.unobserve(entry.target);
    }
  });
}, {
  // Set the threshold to 0.8, meaning the element
  // must be at least 80% visible in the viewport
  threshold: 0.8
});

// Observe each "mark" element
markers.forEach(mark => {
  observer.observe(mark);
});
