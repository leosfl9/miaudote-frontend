"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationCard from "@/components/ConfirmationCard";

export default function ConfirmacaoPage() {
  const router = useRouter();
  const [role, setRole] = useState<"adotante" | "parceiro" | null>(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // só roda no client
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role") as "adotante" | "parceiro" | null;
    setRole(roleParam);

    const flag = sessionStorage.getItem("justRegistered");
    if (!roleParam || !flag || flag !== roleParam) {
      router.replace("/tipo-cadastro");
    } else {
      setValid(true);
    }
  }, [router]);

  if (!valid || !role) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
      bg-[url('/grafo_fundo.png')] bg-no-repeat bg-cover bg-center">
      <ConfirmationCard role={role} />
    </div>
  );
}
