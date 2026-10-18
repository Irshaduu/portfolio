// How many questions one visitor may ask: 10 a minute, 50 a day.
//
// This is a fair-share rule, not a wall. The counts live in one Worker's memory, and Cloudflare
// runs many Workers, so a determined script can get past it. That's fine here: the AI services are
// on free plans with no card, so the worst a flood can do is use up today's free quota, and then
// visitors get the ready-made answers until it resets. Nobody can run up a bill.
//
// A real person rarely asks more than one question every six seconds (answers take a few seconds
// to arrive, and longer to read), so ten a minute only stops scripts. The free quotas are shared
// by every visitor, so a bigger share for one person is a smaller one for everyone else.
//
// allow(visitor) says true, or which limit the visitor reached and how long until they may ask
// again: { limit: 'minute' | 'day', wait } (seconds). The page says it in the agent's own voice.
// allow.left(visitor) says how many questions they have left today, for the page's "5 left today".

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function makeLimiter({ perMinute = 10, perDay = 50, now = Date.now } = {}) {
  const visitors = new Map(); // visitor -> times of their recent questions

  allow.left = (visitor) => Math.max(0, perDay - (visitors.get(visitor) ?? []).filter((at) => now() - at < DAY).length);
  return allow;

  function allow(visitor) {
    const t = now();
    const times = (visitors.get(visitor) ?? []).filter((at) => t - at < DAY);
    const lastMinute = times.filter((at) => t - at < MINUTE);
    if (times.length >= perDay || lastMinute.length >= perMinute) {
      visitors.set(visitor, times);
      // The day's limit first: waiting a minute wouldn't help.
      return times.length >= perDay
        ? { limit: 'day', wait: Math.ceil((times[0] + DAY - t) / 1000) }
        : { limit: 'minute', wait: Math.ceil((lastMinute[0] + MINUTE - t) / 1000) };
    }
    times.push(t);
    visitors.set(visitor, times);
    // Keep memory small: forget visitors who have gone quiet.
    if (visitors.size > 5000) {
      for (const [key, list] of visitors) if (!list.length || t - list[list.length - 1] > DAY) visitors.delete(key);
    }
    return true;
  }
}
