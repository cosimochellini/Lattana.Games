const localStorageName = "LS_COLOR";

const exportColors = (map: Map<string, string>) => {
  try {
    localStorage.setItem(localStorageName, JSON.stringify(Array.from(map)));
  } catch (error) {
    localStorage.setItem(localStorageName, JSON.stringify([]));
  }
};

const importColors = (): Map<string, string> => {
  try {
    return new Map(JSON.parse(localStorage.getItem(localStorageName) ?? ""));
  } catch (error) {
    return new Map();
  }
};

const cachedElements = importColors();

const getColor = (value: string) => {
  if (!cachedElements.has(value)) {
    cachedElements.set(value, "#" + intToRGB(hashCode(value)));
    exportColors(cachedElements);
  }

  return cachedElements.get(value) as string;
};

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
};

export { getColor };
