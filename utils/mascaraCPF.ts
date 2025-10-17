export default function mascaraCPF(cpf: string) {
  const numeros = cpf.replace(/\D/g, '');

  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}