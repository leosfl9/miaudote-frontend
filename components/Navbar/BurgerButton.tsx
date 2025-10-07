import { Menu, X } from "lucide-react";

interface BurgerButtonProps {
    open: boolean;
    onClick: () => void;
    tipo?: string;
}

export default function BurgerButton({ open, onClick, tipo }: BurgerButtonProps) {
    return (
        <button onClick={onClick} className={`${tipo == "adotante" ? "glg:hidden" : "lg:hidden"}`}>
            <Menu className={`text-text-black w-6 h-6 md:w-7 md:h-7 active:text-miau-green transition`} />
        </button>
    );
}