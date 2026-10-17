// Loads a module, and asks again if the network drops it: twice more, a little later each time.
// A browser may remember a failed load, so each new try asks for a fresh URL. Pass an absolute
// URL (new URL('./x.js', import.meta.url)), so the stamped versions in index.html's import map apply.

export async function load(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await import(attempt ? `${url}?retry=${attempt}` : `${url}`);
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
}
