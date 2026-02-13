export function popRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const idx = Math.floor(Math.random() * arr.length);
  const picked = arr[idx];
  arr[idx] = arr[arr.length - 1];
  arr.pop();
  return picked;
}
