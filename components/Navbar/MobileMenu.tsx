"use client";

import { useState } from "react";
import BurgerButton from "./BurgerButton";
import SideMenu from "./SideMenu"

interface MenuProps {
  tipo?: string;
}

export default function MobileMenu({tipo}: MenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BurgerButton open={open} onClick={() => setOpen(true)} />
      <SideMenu open={open} onClose={() => setOpen(false)} tipo={tipo} />
    </>
  );
}