export function formatarData(ddmmyyyy: string) {
  // separa a data em dia, mes e ano, sempre que encontrar uma /
  const [dd, mm, yyyy] = ddmmyyyy.split('/');
  // retorna a data formatada
  return `${yyyy}-${mm}-${dd}`;
}
