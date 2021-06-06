export function getNatural(value) {
  return Math.floor(value < 0 ? value * -1 : value);
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = getNatural(decimals);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function bytesSizeConverter(size, fromUnit, toUnit, decimals = 2) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const from = units.indexOf(fromUnit.toUpperCase());
  const to = units.indexOf(toUnit.toUpperCase());
  const BASE_SIZE = 1024;
  let result = 0;

  if (from < 0 || to < 0) return (result = 'Error: Incorrect units');

  result =
    from < to
      ? size / (BASE_SIZE * (to - from))
      : size * (BASE_SIZE * (from - to));
  return result.toFixed(decimals);
}

export function round(value, decimals = 2) {
  decimals = getNatural(decimals);

  let multiplier = 1;
  for (let i = decimals; i--; ) multiplier *= 10;

  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}
