export const range = (r: [number, number], value: number): boolean => {
  const [start, end] = r;
  return value >= start && value <= end;
};
