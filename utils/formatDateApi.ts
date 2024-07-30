import dayjs from "#build/dayjs.imports.mjs";

export default function (value: any) {
  return dayjs(value).format("DD/MM/YYYY")
}
