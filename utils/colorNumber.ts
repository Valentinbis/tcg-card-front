export default function (value: number) {
  return {
    'text-red-500': value < 0,
    'text-green-500': value > 0,
  };
}
