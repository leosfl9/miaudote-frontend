"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-miau-purple text-background text-center">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="mb-8 text-lg lg:text-xl">Ops! Parece que essa página não existe! 🐾</p>
      <Link href="/" className="px-6 py-3 bg-background text-miau-purple rounded-xl font-semibold hover:bg-miau-green hover:text-background transition lg:text-lg">
        Voltar para o início
      </Link>
    </div>
  );
}