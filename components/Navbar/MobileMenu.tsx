"use client";

import { useState } from "react";
import BurgerButton from "./BurgerButton";
import SideMenu from "./SideMenu"

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BurgerButton open={open} onClick={() => setOpen(true)} />
      <SideMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}