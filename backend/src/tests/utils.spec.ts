import { describe, expect, it } from 'vitest';
import { splitArray } from '../lib/utils.js';

describe('splitArray', () => {
  it('splits array into pass and fail', () => {
    const [pass, fail] = splitArray([3, 8, 4, 6, 2, 1, 9, 7, 5], (n) => n > 5);

    expect(pass.sort((a, b) => a - b)).toEqual([6, 7, 8, 9]);
    expect(fail.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });
});
