export function validaIdade(dataNasc: string, minAge = 16): { valido: boolean; mensagem?: string } {
  const s = dataNasc.trim();
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(s)) {
    return { valido: false, mensagem: "Formato de data inválido" };
  }

  const [ddStr, mmStr, yyyyStr] = s.split("/");
  const dia = Number(ddStr);
  const mes = Number(mmStr);
  const ano = Number(yyyyStr);

  const nascimentoUTC = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    nascimentoUTC.getUTCFullYear() !== ano ||
    nascimentoUTC.getUTCMonth() !== mes - 1 ||
    nascimentoUTC.getUTCDate() !== dia
  ) {
    return { valido: false, mensagem: "Data de nascimento inválida" };
  }

  const hoje = new Date();
  const corteUTC = new Date(Date.UTC(hoje.getFullYear() - minAge, hoje.getMonth(), hoje.getDate()));

  if (nascimentoUTC.getTime() > corteUTC.getTime()) {
    return { valido: false, mensagem: `Você deve ter pelo menos ${minAge} anos` };
  }

  return { valido: true };
}

