const store = {
  startInTray: true,
  firstTimeInApp: false,
};

export const set = (key: keyof typeof store, value: any) => {
  store[key] = value;
};

export const get = <T>(key: keyof typeof store): T => {
  return store[key] as T;
};
