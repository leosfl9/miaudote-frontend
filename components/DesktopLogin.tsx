import Link from "next/link";

export default function DesktopLogin() {
    return (
        <Link href={"/Login"} className="hidden lg:flex px-7 py-4 rounded-4xl 
            shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-miau-green hover:text-background active:bg-miau-orange transition">
            Login
        </Link>
    );
}