export function validaSenha(senha: string, minLength = 8) {
  // se a senha não for uma string, é inválida 
  if (typeof senha !== "string") {
    return { valido: false, mensagem: "Senha inválida" };
  }

  // se a senha começar ou terminar com espaços, é inválida
  if (/^\s|\s$/.test(senha)) {
    return { valido: false, mensagem: "A senha não pode começar ou terminar com espaços" };
  }

  // se a senha tiver menos de 8 caracteres, é inválida
  if (senha.length < minLength) {
    return { valido: false, mensagem: `A senha deve ter no mínimo ${minLength} caracteres` };
  }

  // se a senha não tiver pelo menos 1 letra maiúscula, é inválida
  if (!/[A-Z]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 letra maiúscula" };
  }

  // se a senha não tiver pelo menos 1 letra minúscula, é inválida
  if (!/[a-z]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 letra minúscula" };
  }

  // se a senha não tiver pelo menos 1 número, é inválida
  if (!/[0-9]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 número" };
  }

  // se a senha não tiver pelo menos 1 caractere especial, é inválida
  if (!/[^A-Za-z0-9]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 caractere especial" };
  }

  // retorna true se nenhuma validação der false
  return { valido: true, mensagem: null };
}

