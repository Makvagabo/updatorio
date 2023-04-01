export const getMode = () =>
  process.env.NODE_ENV === 'development' ? 'development' : 'production';
