import Link from "next/link";

interface LinkButtonProps {
    href: string;
    text: string;
    center?: boolean;
    hidden?: boolean;
    bottom?: boolean;
    color: "white" | "orange" | "green";
    back?: boolean;
}

export default function LinkButton({href, text, center, hidden, bottom, color, back}: LinkButtonProps) {
    return (
        <Link href={href} className={`${hidden ? "hidden lg:flex" : ""} px-7 py-4 rounded-4xl 
            shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition font-medium 
            ${center ? "text-center" : ""} ${bottom ? "mt-auto" : ""} ${back ? "text-xl lg:text-2xl xl:text-3xl" : ""}
            ${color == "white" ? "bg-background text-text-black hover:bg-miau-green active:bg-miau-light-green active:text-background hover:text-background" : ""}
            ${color == "green" ? "bg-miau-green text-background hover:bg-miau-light-green active:bg-miau-light-green" : ""} 
            ${color == "orange" ? "bg-miau-orange text-text-black hover:bg-miau-green active:bg-miau-light-green hover:text-background font-bold" : ""}`}>
            {text}
        </Link>
    );
}