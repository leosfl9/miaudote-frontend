"use client";

import PrivateNavbar from "@/components/PrivateNavbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter(); // hook de roteamento

  // verifica se o usuário está autenticado e é um parceiro. se não for, envia-o para fazer login
  useEffect(() => {
    const tipo = Cookies.get("tipo");
    const token = Cookies.get("token");
    
    if (tipo !== "parceiro" || !token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
        <PrivateNavbar tipo="parceiro" />
        {children}
    </div>

  );
}