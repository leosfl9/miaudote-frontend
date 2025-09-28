export function validaSenha(senha: string, minLength = 8) {
  if (typeof senha !== "string") {
    return { valido: false, mensagem: "Senha inválida" };
  }

  if (senha.length < minLength) {
    return { valido: false, mensagem: `A senha deve ter no mínimo ${minLength} caracteres` };
  }

  if (!/[A-Z]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 letra maiúscula" };
  }

  if (!/[a-z]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 letra minúscula" };
  }

  if (!/[0-9]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 número" };
  }

  if (!/[^A-Za-z0-9]/.test(senha)) {
    return { valido: false, mensagem: "A senha deve conter pelo menos 1 caractere especial" };
  }

  return { valido: true, mensagem: null };
}
