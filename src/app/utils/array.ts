/**
 * Returns a `count`-length window into `list` starting at `start`,
 * wrapping around the end (modulo). If list is shorter than count,
 * returns the whole list as-is.
 *
 * Used for carousel-style rotations (flash sale, best-selling).
 */
export const cycleSlice = <T>(list: T[], start: number, count: number): T[] => {
  if (list.length <= count) {
    return list;
  }

  return Array.from({ length: count }, (_, index) => {
    return list[(start + index) % list.length];
  });
};
