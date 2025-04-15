export function sortObjectKeys(map) {
  return new Map(
    [...map.entries()].sort(([a], [b]) => new Date(a) - new Date(b))
  );
}
