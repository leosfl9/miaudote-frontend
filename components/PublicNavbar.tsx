import Link from "next/link";
import Image from "next/image";

export default function PublicNavbar() {
    return (
        <div className="w-full px-12 py-2 shadow-sm flex justify-between items-center text-3xl text-text-black">
            <Link href={"/"} className="relative w-72 h-24">
                <Image src={"/logo-main.png"} alt="Logo Miaudote" fill />
            </Link>
            <ul className="flex justify-between w-fit gap-16">
                <li><Link className="hover:text-miau-green transition" href={"/"}>Home</Link></li>
                <li><Link className="hover:text-miau-green transition" href={"/Sobre"}>Sobre</Link></li>
                <li><Link className="hover:text-miau-green transition" href={"/ONGs"}>ONGs</Link></li>
            </ul>
            <Link href={"/Login"} className="px-7 py-4 rounded-4xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-miau-green hover:text-background transition">
                Login
            </Link>
        </div>
    );
}