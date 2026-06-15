export function unFlattenObject(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const flatKey in obj) {
    const keys = flatKey.split(".");
    keys.reduce<Record<string, unknown>>((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = obj[flatKey];
        return acc;
      }
      if (!acc[key]) acc[key] = {};
      return acc[key] as Record<string, unknown>;
    }, result);
  }
  return result;
}
