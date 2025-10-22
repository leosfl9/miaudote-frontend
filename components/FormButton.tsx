"use client"

import { ButtonHTMLAttributes } from "react";

// tipagem das props do botão de formulário
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color: "green" | "orange" | "purple" | "disabled" | "disabled-purple";
}

export default function FormButton({ text, color, onClick, className, ...props }: ButtonProps) {
  return (
    // componente de botão
    <button onClick={onClick} className={`
        w-full text-xl py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        ${color == "green" && "bg-miau-green hover:bg-miau-light-green active:bg-miau-light-green"}
        ${color == "orange" && "bg-miau-orange hover:bg-miau-green active:bg-miau-light-green"}
        ${color == "purple" && "bg-miau-purple hover:bg-miau-green active:bg-miau-light-green"}
        ${color == "disabled" && "bg-miau-green/70"}
        ${color == "disabled-purple" && "bg-miau-purple/70"}
        ${className}`}
      {...props}>
      {text}
    </button>
  );
}