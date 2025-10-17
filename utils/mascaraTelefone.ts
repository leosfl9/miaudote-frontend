export default function mascaraTelefone(telefone: string) {
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } 
  
  return telefone; // caso já esteja mascarado ou inválido
}