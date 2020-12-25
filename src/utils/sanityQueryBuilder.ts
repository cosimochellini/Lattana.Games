export const contains = (param: string) => `*${param}*`;

export const startWith = (param: string) => `*${param}`;

export const endWith = (param: string) => `${param}*`;

export const empty = (array: string[]) => (array.length ? array : [""]);
