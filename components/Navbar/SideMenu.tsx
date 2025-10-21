"use client";

import { X } from "lucide-react";
import MobileLinks from "./MobileLinks";

// tipagem das props da sidebar
interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  tipo?: string;
}

export default function SideMenu({ open, onClose, tipo }: SideMenuProps) {
  return (
    <>
      {/* div que escurece o fundo da tela */}
      <div onClick={onClose} className={`z-2 fixed ${tipo == "adotante" ? "glg:hidden" : "lg:hidden"} inset-0 bg-black/40 transition-opacity duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"}`}/>

      {/* componente de sidebar */}
      <div className={`z-3 ${tipo == "adotante" ? "glg:hidden" : "lg:hidden"} flex flex-col fixed top-0 right-0 h-full w-68 bg-background p-6 transition-transform duration-300 
        ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* botão de fechar */}
        <button onClick={onClose} className="mb-6">
          <X className="text-text-black active:text-miau-green transition w-6 h-6 md:w-7 md:h-7" />
        </button>

        {/* links da sidebar */}
        <MobileLinks tipo={tipo} />
      </div>
    </>
  );
}