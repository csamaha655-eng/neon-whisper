/**
 * Get a random delay between min and max milliseconds
 */
export function getRandomDelay(min: number = 1500, max: number = 4000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sleep for a random duration between min and max
 */
export async function randomSleep(min: number = 1500, max: number = 4000): Promise<void> {
  const delay = getRandomDelay(min, max);
  await sleep(delay);
}
