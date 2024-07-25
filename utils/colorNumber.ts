export default function (value: any) {
  return {
    "text-red-500": value < 0,
    "text-green-500": value > 0,
  };
}
