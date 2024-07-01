/**
 * Returns a random element from the given array.
 *
 * @param array The array to pick from.
 */
export function random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}
