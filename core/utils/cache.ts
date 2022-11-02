const basicKey = "sjt_";

const hasItem = (key) => {
  const _key = basicKey + key;
  if (localStorage.getItem(_key)) {
    return true;
  } else {
    return false;
  }
};

export const getCache = (key) => {
  const _key = basicKey + key;
  const cache = localStorage.getItem(_key);
  if(cache) {
    return JSON.parse(cache)
  }
  return null;
};

export const setCache = (key, value) => {
  if(value === undefined) value = null
  const _key = basicKey + key;
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(_key, value);
};
