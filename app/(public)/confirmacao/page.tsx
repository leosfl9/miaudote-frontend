"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationCard from "@/components/ConfirmationCard";

export default function ConfirmacaoPage() {
  const router = useRouter(); // hook para enviar usuário para outra página
  const searchParams = useSearchParams(); // hook para ler os parâmetros passados na url
  const role = searchParams.get("role") as "adotante" | "parceiro" | null; // leitura dos parâmetors da url, obtendo o tipo do usuário recém-cadastrado

  // estado de validade do usuário, mantendo-o ou não na página
  const [valid, setValid] = useState(false);

  // hook para verificar a validade do usuário, sempre que haver uma alteração na role
  useEffect(() => {
    const flag = sessionStorage.getItem("justRegistered"); // obtém do sessionStorage o estado de recém-cadastro
    if (!role || !flag || flag !== role) { // se o usuário não for recém-cadastrado, envia-o para a página de tipo de cadastro
      router.replace("/tipo-cadastro");
    } else {
      setValid(true); // se for, valida-o
    }
  }, [role, router]);

  // evita piscar a tela errada
  if (!valid) return null; 

  return (
    <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
      bg-[url('/grafo_fundo.png')] bg-no-repeat bg-cover bg-center">
      {/* chamada do card */}
      <ConfirmationCard role={role as "adotante" | "parceiro"} />
    </div>
  );
}
