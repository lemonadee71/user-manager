/**
 * Splits an array into two arrays based on a predicate function.
 * @param array The array to split
 * @param predicate Function that returns true/false for each element
 * @returns [arrayMatchingPredicate, arrayNotMatchingPredicate]
 */
export function splitArray<T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }
  return [pass, fail];
}
