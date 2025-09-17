import { StateStorage } from "zustand/middleware";

export const createBrowserStorage = (keyPrefix = ""): StateStorage => {
  return {
    getItem: (name) => {
      if (typeof window === "undefined") return null;
      try {
        return Promise.resolve(localStorage.getItem(`${keyPrefix}${name}`));
      } catch {
        return Promise.resolve(null);
      }
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") return Promise.resolve();
      try {
        localStorage.setItem(`${keyPrefix}${name}`, value);
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    },
    removeItem: (name) => {
      if (typeof window === "undefined") return Promise.resolve();
      try {
        localStorage.removeItem(`${keyPrefix}${name}`);
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    },
  };
};
