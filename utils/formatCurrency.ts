export default function (value: number) {
  return value.toLocaleString('fr-fr', { style: 'currency', currency: 'EUR' });
}
