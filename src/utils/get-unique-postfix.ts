export function getUniquePostfix() {
  return new Date()
    .toISOString()
    .substring(0, 19)
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace("T", ".");
}
