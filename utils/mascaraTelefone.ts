export default function mascaraTelefone(telefone: string) {
  // remove traços e parênteses do numero
  const numeros = telefone.replace(/\D/g, "");
  // se o número tiver o tamanho correto (11 dígitos), retorna-o formatado com parênteses e traços em forma de string
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } 
  
  // caso já esteja mascarado ou inválido
  return telefone; 
}