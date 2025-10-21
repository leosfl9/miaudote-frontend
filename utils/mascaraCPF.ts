export default function mascaraCPF(cpf: string) {
  // remove pontos e traços do cpf
  const numeros = cpf.replace(/\D/g, '');
  // retorna o cpf formatado com pontos e traços, em formato de string
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}