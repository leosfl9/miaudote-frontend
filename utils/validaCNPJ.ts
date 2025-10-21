export function validaCNPJ(cnpj: string): boolean {
  // remove tudo que não é número do cnpj
  cnpj = cnpj.replace(/[^\d]+/g, "");

  // se o tamanho for diferente de 14, retorna false
  if (cnpj.length !== 14) return false;
  // se todos os dígitos forem iguais, retorna false
  if (/^(\d)\1{13}$/.test(cnpj)) return false; 

  // cálculo do primeiro dígito verificador
  let tamanho = 12;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  // cálculo do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  // retorna true se nenhuma validação retornar false
  return true;
}
