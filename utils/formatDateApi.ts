import dayjs from '#build/dayjs.imports.mjs';

export default function (value: Date | string) {
  return dayjs(value).format('DD/MM/YYYY');
}
