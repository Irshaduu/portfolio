// 1992: follow links the Line Mode Browser way. Every link shows a number (see 1992.css);
// type the number and press Return.

let stop = null;

const links = () =>
  [...document.querySelectorAll('.masthead a[href], main a[href], .footer a[href]')].filter(
    (a) => a.getClientRects().length > 0, // hidden ornaments carry no number
  );

export function enter() {
  const input = document.querySelector('.tm__lmb-input');
  const prompt = document.querySelector('.tm__lmb');
  let buffer = '';

  const show = () => {
    input.textContent = buffer;
  };
  prompt.firstChild.textContent = `Type a link number (1-${links().length}) and press Return: `;

  const onKey = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input:not([type="range"]), textarea, [contenteditable]')) return;

    if (/^[0-9]$/.test(event.key)) buffer = (buffer + event.key).slice(-3);
    else if (event.key === 'Backspace' && buffer) buffer = buffer.slice(0, -1);
    else if (event.key === 'Escape') buffer = '';
    else if (event.key === 'Enter' && buffer) {
      const target = links()[Number(buffer) - 1];
      buffer = '';
      if (target) {
        event.preventDefault();
        target.click();
      }
    } else return;
    show();
  };

  addEventListener('keydown', onKey);
  stop = () => {
    removeEventListener('keydown', onKey);
    buffer = '';
    show();
  };
}

export function leave() {
  stop?.();
  stop = null;
}
