export function validaIdade(dataNasc: string, minAge = 16): { valido: boolean; mensagem?: string } {
  // remove espaços antes e depois da string
  const s = dataNasc.trim();
  // valida o formato da data (dd/mm/yyyy)
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!regex.test(s)) {
    return { valido: false, mensagem: "Formato de data inválido" };
  }

  // separa o dia, mes e ano da data, sempre que encontrar uma /
  const [ddStr, mmStr, yyyyStr] = s.split("/");
  const dia = Number(ddStr);
  const mes = Number(mmStr);
  const ano = Number(yyyyStr);

  // constrói uma data em utc utilizando os valores recebidos
  // o mes é - 1 pois no Date os meses vão de 0 a 11, e não de 1 a 12
  const nascimentoUTC = new Date(Date.UTC(ano, mes - 1, dia));

  // válida a existência dessa data no calendário (evitando dia 30 de fevereiro, ou 29 de fevereiro de 2003 por exemplo)
  if (
    nascimentoUTC.getUTCFullYear() !== ano ||
    nascimentoUTC.getUTCMonth() !== mes - 1 ||
    nascimentoUTC.getUTCDate() !== dia
  ) {
    return { valido: false, mensagem: "Data de nascimento inválida" };
  }

  // armazena a data de hoje
  const hoje = new Date();
  // baseada na data de hoje, armazena a data necessária para o usuário ter exatamente 16 anos
  const corteUTC = new Date(Date.UTC(hoje.getFullYear() - minAge, hoje.getMonth(), hoje.getDate()));

  // verifica se o usuário tem mais de 16 anos
  if (nascimentoUTC.getTime() > corteUTC.getTime()) {
    return { valido: false, mensagem: `Você deve ter pelo menos ${minAge} anos` };
  }

  // retorna true se nenhuma validação der false
  return { valido: true };
}

