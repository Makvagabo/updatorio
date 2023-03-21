export const getUniquePostfix = () =>
  new Date()
    .toISOString()
    .substring(0, 23)
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\./g, '')
    .replace('T', '.');
