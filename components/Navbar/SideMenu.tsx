"use client";

import { X } from "lucide-react";
import Link from "next/link";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  return (
    <>
      {/* Div que escurece o fundo da tela */}
      <div onClick={onClose} className={`z-2 fixed lg:hidden inset-0 bg-black/40 transition-opacity duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"}`}/>

      {/* Menu lateral */}
      <div className={`z-3 lg:hidden flex flex-col fixed top-0 right-0 h-full w-64 bg-background p-6 transition-transform duration-300 
        ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Botão de fechar */}
        <button onClick={onClose} className="mb-6">
          <X className="text-text-black active:text-miau-green transition w-6 h-6 md:w-7 md:h-7" />
        </button>

        <nav className="flex flex-col space-y-4 text-text-black text-2xl md:text-[28px]">
          <Link className="active:text-miau-green transition" href={"/"}>Home</Link>
          <Link className="active:text-miau-green transition" href={"/Sobre"}>Sobre</Link>
          <Link className="active:text-miau-green transition" href={"/ONGs"}>ONGs</Link>
        </nav>

        <Link href={"/Login"} className="px-5 py-2 md:px-6 md:py-3 text-2xl md:text-[28px] mt-auto rounded-4xl 
          bg-miau-green text-background active:bg-miau-green/80 transition">
          Login
        </Link>
      </div>
    </>
  );
}