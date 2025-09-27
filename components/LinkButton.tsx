import Link from "next/link";

interface LinkButtonProps {
    href: string;
    text: string;
    center?: boolean;
    hidden?: boolean;
    bottom?: boolean;
    color: "white" | "orange" | "green";
}

export default function LinkButton({href, text, center, hidden, bottom, color}: LinkButtonProps) {
    return (
        <Link href={href} className={`${hidden ? "hidden lg:flex" : ""} px-7 py-4 rounded-4xl 
            shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition
            ${center ? "text-center" : ""} ${bottom ? "mt-auto" : ""} 
            ${color == "white" ? "bg-background text-text-black hover:bg-miau-green active:bg-miau-green/80 active:text-background hover:text-background" : ""}
            ${color == "green" ? "bg-miau-green text-background hover:bg-miau-green/80 active:bg-miau-green/80" : ""} 
            ${color == "orange" ? "bg-miau-orange text-text-black hover:bg-miau-green active:bg-miau-green/80 hover:text-background font-bold" : ""}`}>
            {text}
        </Link>
    );
}