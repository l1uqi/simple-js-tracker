const basicKey = "SIMPLE_JS_TRACKER";

const hasItem = (key) => {
  const _key = basicKey + key;
  if (sessionStorage.getItem(_key)) {
    return true;
  } else {
    return false;
  }
};

export const getCache = (key) => {
  const _key = basicKey + key;
  const cache = sessionStorage.getItem(_key);
  if(cache) {
    try {
      return JSON.parse(cache)
    } catch (error) {
      return cache
    }
  }
  return null;
};

export const setCache = (key, value) => {
  if(value === undefined) value = null
  const _key = basicKey + key;
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  sessionStorage.setItem(_key, value);
};
