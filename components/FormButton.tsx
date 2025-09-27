"use client"

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: "green" | "orange";
}

export default function FormButton({ text, color, onClick, className, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-xl py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        ${color === "green" && "bg-miau-green hover:bg-miau-light-green active:bg-miau-light-green"}
        ${className}
      `}
      {...props}>
      {text}
    </button>
  );
}