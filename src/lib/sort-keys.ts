function sortKeys<T>(obj: Record<string, T>) {
  return Object.keys(obj)
    .toSorted()
    .reduce<Record<string, T>>((acc, k) => {
      acc[k] = obj[k] as T;
      return acc;
    }, {});
}

export { sortKeys };
