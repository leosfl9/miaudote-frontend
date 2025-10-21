"use client";

import { useState } from "react";
import BurgerButton from "./BurgerButton";
import SideMenu from "./SideMenu"

// tipagem da prop do menu mobile
interface MenuProps {
  tipo?: string;
}

export default function MobileMenu({tipo}: MenuProps) {
  const [open, setOpen] = useState(false); // estado de aberto ou fechado

  // chamada do burger button e da sidebar
  return (
    <>
      <BurgerButton open={open} onClick={() => setOpen(true)} tipo={tipo} />
      <SideMenu open={open} onClose={() => setOpen(false)} tipo={tipo} />
    </>
  );
}