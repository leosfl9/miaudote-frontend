"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationCard from "@/components/ConfirmationCard";

export default function ConfirmacaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "adotante" | "parceiro" | null;

  const [valid, setValid] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("justRegistered");
    if (!role || !flag || flag !== role) {
      router.replace("/tipo-cadastro"); // se não tiver flag válida, expulsa
    } else {
      setValid(true);
    }
  }, [role, router]);

  if (!valid) return null; // evita piscar a tela errada

  return (
    <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
      <ConfirmationCard role={role as "adotante" | "parceiro"} />
    </div>
  );
}
