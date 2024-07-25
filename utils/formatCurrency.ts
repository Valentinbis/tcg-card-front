export default function (value: any) {
  return value.toLocaleString("fr-fr", { style: "currency", currency: "EUR" });
}
