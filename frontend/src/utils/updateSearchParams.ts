export function updateSearchParams(
  current: URLSearchParams,
  updates: Record<string, string | number | null>,
) {
  const params = new URLSearchParams(current);
  const shouldResetPage = Object.keys(updates).some((key) => key !== "page");
  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === "" ||
      value === "All" ||
      value === null
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  if (shouldResetPage) params.set("page", "1");
  return params;
}
