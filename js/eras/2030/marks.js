// 2030's project symbols: says when each station has arrived, so its symbol makes its one move
// (css/eras/2030.css). Drawing the symbol on is tied to scroll in CSS; this is only the moment
// after, once per visit to 2030. Nothing moves with reduced motion.

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let watch = null;

export function startMarks() {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  // Arrived: the whole symbol is in the top 58% of the screen, just as it finishes drawing.
  watch = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      watch.unobserve(target);
      target.classList.add('is-arriving');
      setTimeout(() => target.classList.remove('is-arriving'), 1400);
    }
  }, { rootMargin: '0px 0px -42% 0px', threshold: 1 });
  for (const mark of document.querySelectorAll('.project .mark')) watch.observe(mark);
}

export function stopMarks() {
  watch?.disconnect();
  watch = null;
  for (const mark of document.querySelectorAll('.mark.is-arriving')) mark.classList.remove('is-arriving');
}
