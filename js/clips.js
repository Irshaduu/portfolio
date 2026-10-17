// The live apps' phone clips (.duo video): each plays only while its card is on screen, and never
// with reduced motion or Save-Data, when the still picture underneath stands in. In eras before
// web video the clip is hidden, has no box, and so reads as off screen and stays paused.

const clips = [...document.querySelectorAll('.duo video')];
const still = matchMedia('(prefers-reduced-motion: reduce)');

if (clips.length && 'IntersectionObserver' in window && !navigator.connection?.saveData) {
  const onScreen = new Set();
  const sync = (video) => {
    if (onScreen.has(video) && !still.matches) video.play().catch(() => {});
    else video.pause();
  };
  const watch = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) onScreen.add(target);
      else onScreen.delete(target);
      sync(target);
    }
  }, { threshold: 0.4 });
  for (const video of clips) {
    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    watch.observe(video);
  }
  still.addEventListener('change', () => clips.forEach(sync));
}

// The catering card's two pages (.shot .pages) shuffle on the same terms: only while the card is
// on screen. Reduced motion stops them in CSS; in 1992 they have no box, so they never start.
const stacks = [...document.querySelectorAll('.shot .pages')];
if (stacks.length && 'IntersectionObserver' in window) {
  const watch = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) target.classList.toggle('is-on', isIntersecting);
  }, { threshold: 0.4 });
  for (const stack of stacks) watch.observe(stack);
}
