import Link from "next/link";
import Image from "next/image";
import DesktopLinks from "./Navbar/DesktopLinks";
import DesktopLogin from "./Navbar/DesktopLogin";
import MobileMenu from "./Navbar/MobileMenu";

export default function PublicNavbar() {
    return (
        // componente de navbar
        <nav className="relative w-full px-4 sm:px-7 lg:px-10 xl:px-12 py-2 shadow-md bg-background
            flex justify-between items-center text-3xl text-text-black ">
            {/* link para a home pública */}
            <Link href={"/"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-72 xl:h-24">
                <Image src={"/logo-main.png"} alt="Logo Miaudote" fill />
            </Link>

            {/* links da navbar que serão escondidos no mobile */}
            <DesktopLinks />
            {/* botão de login */}
            <DesktopLogin />
            {/* Menu mobile */}
            <MobileMenu />
        </nav>
    );
}