"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter(); // hook de roteamento
  const [isClient, setIsClient] = useState(false); // verifica que o browser já montou a página do lado do cliente

  // marca que a página já está renderizada no client (evita mismatch SSR/CSR)
  // apenas uma precaução no uso do router.back() para acessar a última página que o usuário esteve
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-miau-purple text-background text-center">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="mb-8 text-lg lg:text-xl">Ops! Parece que essa página não existe! 🐾</p>
      {/* link para a última página acessada */}
      {isClient && (
        <button onClick={() => router.back()} className="px-6 py-3 bg-background text-miau-purple rounded-xl 
          font-semibold hover:bg-miau-green hover:text-background transition lg:text-lg cursor-pointer">
          Voltar para a última página
        </button> 
      )}
    </div>
  );
}