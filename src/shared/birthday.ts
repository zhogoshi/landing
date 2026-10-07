const birth = Date.UTC(2007, 1, 2);
export const yearMs = 365.2425 * 24 * 60 * 60 * 1000;

export function isBirthday(now = new Date()) {
  return now.getMonth() === 1 && now.getDate() === 2;
}

export function ageYears(now: number) {
  return ((now - birth) / yearMs).toFixed(8);
}
