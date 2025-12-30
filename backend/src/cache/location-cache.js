// Cache RAM đơn giản

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

export const provinceCache = new Map();
export const communeCache = new Map();

export const getCache = (cache, key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (cached.expire < Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

export const setCache = (cache, key, data) => {
  cache.set(key, {
    expire: Date.now() + CACHE_TTL,
    data,
  });
};
