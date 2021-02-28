const readable = (data: unknown) => JSON.parse(JSON.stringify(data));

const bindReadable = <T>(
  data: T,
  mutator: ((data: T) => unknown) | null = null
) => readable(mutator ? mutator(data) : data);

export const logNice = <T>(
  data: T,
  mutator: ((data: T) => unknown) | null = null
) => {
  console.log(bindReadable(data, mutator));
  return data;
};

export const tableNice = <T>(
  data: T,
  mutator: ((data: T) => unknown) | null = null
) => {
  console.table(bindReadable(data, mutator));
  return data;
};
