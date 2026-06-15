export function flattenObjects(
  obj: Record<string, unknown>,
  prefix = "",
  res: Record<string, unknown> = {},
) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObjects(value as Record<string, unknown>, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
}
