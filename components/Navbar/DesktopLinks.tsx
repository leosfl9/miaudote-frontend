import Link from "next/link";
import { PawPrint, HandHeart, Settings, Home, Heart, User } from "lucide-react";

interface LinksProps {
    tipo?: string;
}

export default function DesktopLinks({tipo}: LinksProps) {
    switch (tipo) {
        case undefined: 
            return (
                <ul className="hidden lg:flex justify-between w-fit gap-16">
                    <li><Link className="hover:text-miau-green active:text-miau-green/80 transition" href={"/"}>Home</Link></li>
                    <li><Link className="hover:text-miau-green active:text-miau-green/80 transition" href={"/Sobre"}>Sobre</Link></li>
                    <li><Link className="hover:text-miau-green active:text-miau-green/80 transition" href={"/ONGs"}>ONGs</Link></li>
                </ul>
            )
        case "parceiro":
            return (
                <ul className="hidden lg:flex items-center justify-between w-fit gap-4 mxl:gap-8 3xl:gap-16">
                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/parceiro/home"}>
                        <PawPrint className="w-8 h-8" />
                        <h1 className="font-semibold">Pets <span className="hidden lxl:inline">cadastrados</span></h1>
                    </Link></li>

                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/parceiro/solicitacoes"}>
                        <HandHeart className="w-8 h-8" />
                        <h1 className="font-semibold">Solicitações <span className="hidden 2xl:inline">de adoção</span></h1>
                    </Link></li>

                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/parceiro/home"}>
                        <Settings className="w-8 h-8" />
                        <h1 className="font-semibold">Configurações</h1>
                    </Link></li>  
                </ul>
            )

        case "adotante":
            return (
                <ul className="hidden glg:flex items-center justify-between w-fit gap-4 mxl:gap-8 3xl:gap-16">
                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/adotante/home"}>
                        <Home className="w-8 h-8" />
                        <h1 className="font-semibold">Home</h1>
                    </Link></li>

                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/adotante/solicitacoes"}>
                        <HandHeart className="w-8 h-8" />
                        <h1 className="font-semibold">Solicitações <span className="hidden 2xl:inline">de adoção</span></h1>
                    </Link></li>

                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/adotante/favoritos"}>
                        <Heart className="w-8 h-8" />
                        <h1 className="font-semibold">Favoritos</h1>
                    </Link></li>

                    <li><Link className="bg-[#F5F7FF] text-text-light-gray hover:bg-miau-purple hover:text-background 
                        flex items-center gap-3 px-4 py-3 rounded-lg" 
                        href={"/adotante/perfil"}>
                        <User className="w-8 h-8" />
                        <h1 className="font-semibold">Perfil</h1>
                    </Link></li>  
                </ul>
            )
    }
}