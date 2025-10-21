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
  const router = useRouter();

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