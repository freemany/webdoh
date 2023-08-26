const storeData = {};
export const setStoreData = (key, data) => {
  if (!key) {
    throw "Key is required";
  }
  storeData[key] = data;
};
export const getStoreData = (key) => {
  if (!key) {
    throw "Key is required";
  }
  return storeData[key];
};
