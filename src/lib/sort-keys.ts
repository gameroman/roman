function sortKeysSpecificOrder<T>(obj: Record<string, T>, keys: string[]) {
  const newObj: Record<string, T> = {};
  for (const key of keys) {
    if (obj[key] === undefined) continue;
    newObj[key] = obj[key];
  }
  return newObj;
}

function sortKeys<T>(obj: Record<string, T>) {
  return Object.keys(obj)
    .toSorted()
    .reduce<Record<string, T>>((acc, k) => {
      acc[k] = obj[k] as T;
      return acc;
    }, {});
}

export { sortKeys, sortKeysSpecificOrder };
