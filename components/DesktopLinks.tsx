import Link from "next/link";

export default function DesktopLinks() {
    return (
        <ul className="hidden lg:flex justify-between w-fit gap-16">
            <li><Link className="hover:text-miau-green active:text-miau-orange transition" href={"/"}>Home</Link></li>
            <li><Link className="hover:text-miau-green active:text-miau-orange transition" href={"/Sobre"}>Sobre</Link></li>
            <li><Link className="hover:text-miau-green active:text-miau-orange transition" href={"/ONGs"}>ONGs</Link></li>
        </ul>
    );
}