import { Menu, X } from "lucide-react";

interface BurgerButtonProps {
    open: boolean;
    onClick: () => void;
}

export default function BurgerButton({ open, onClick }: BurgerButtonProps) {
    return (
        <button onClick={onClick} className="lg:hidden">
            <Menu className="text-text-black w-6 h-6 md:w-7 md:h-7" />
        </button>
    );
}