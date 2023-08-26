// b5dcdc58-a5a7-40c6-a731-67a3b6a16cee
export const uuidv4 = (short = false) => {
  const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

  return short ? uuid.substring(0, 8) : uuid;
};

export const getFuncNameWithHash = (funcName = "") =>
  funcName + "_" + uuidv4().replaceAll("-", "");

export const getCss = async (path) => {
  const res = await fetch(path);

  return res.text();
};

export const nextTick = (cb) => setTimeout(cb);
