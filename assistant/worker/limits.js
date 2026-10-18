// How many questions one visitor may ask: a few a minute, a few dozen a day.
//
// This is a fair-share rule, not a wall. The counts live in one Worker's memory, and Cloudflare
// runs many Workers, so a determined script can get past it. That's fine here: the AI services are
// on free plans with no card, so the worst a flood can do is use up today's free quota, and then
// visitors get the ready-made answers until it resets. Nobody can run up a bill.

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function makeLimiter({ perMinute = 6, perDay = 40, now = Date.now } = {}) {
  const visitors = new Map(); // visitor -> times of their recent questions

  return function allow(visitor) {
    const t = now();
    const times = (visitors.get(visitor) ?? []).filter((at) => t - at < DAY);
    const lastMinute = times.filter((at) => t - at < MINUTE).length;
    if (lastMinute >= perMinute || times.length >= perDay) {
      visitors.set(visitor, times);
      return false;
    }
    times.push(t);
    visitors.set(visitor, times);
    // Keep memory small: forget visitors who have gone quiet.
    if (visitors.size > 5000) {
      for (const [key, list] of visitors) if (!list.length || t - list[list.length - 1] > DAY) visitors.delete(key);
    }
    return true;
  };
}
