export function validaCPF(cpf: string): boolean {
  // remove tudo que não é número do cpf
  cpf = cpf.replace(/[^\d]+/g, "");

  // se o tamanho for diferente de 14, retorna false
  if (cpf.length !== 11) return false;
  // se todos os dígitos forem iguais, retorna false
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // cálculo do primeiro dígito
  let soma = 0;

  for (let i = 0; i < 9; i++) 
    soma += parseInt(cpf.charAt(i)) * (10 - i);

  let resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // segundo dígito
  soma = 0;

  for (let i = 0; i < 10; i++) 
    soma += parseInt(cpf.charAt(i)) * (11 - i);

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  // retorna true se nenhuma validação retornar false
  return true;
}
