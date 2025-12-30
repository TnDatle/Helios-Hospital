const CACHE_TTL = 10 * 1000;

export const doctorListCache = new Map();
export const doctorDetailCache = new Map();

export const setCache = (cache, key, data) => {
  cache.set(key, {
    expire: Date.now() + CACHE_TTL,
    data,
  });
};

export const getCache = (cache, key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (cached.expire < Date.now()) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};
