import Link from "next/link"
import LinkButton from "../LinkButton"

interface LinksProps {
    tipo?: string;
}

export default function MobileLinks({tipo}: LinksProps){
    switch (tipo) {
        case undefined:
            return (
                <>
                    <nav className="flex flex-col space-y-4 text-text-black text-2xl md:text-[28px]">
                        <Link className="active:text-miau-green transition" href={"/"}>Home</Link>
                        <Link className="active:text-miau-green transition" href={"/"}>Sobre</Link>
                        <Link className="active:text-miau-green transition" href={"/"}>ONGs</Link>
                    </nav>

                    <LinkButton href={"/Login"} text={"Login"} center={true} bottom={true} color={"green"} />
                </>
            )
        case "parceiro":
            return (
                <>
                    <nav className="flex flex-col space-y-4 text-text-black text-2xl md:text-[28px]">
                        <Link className="active:text-miau-green transition" href={"/parceiro/home"}>Pets cadastrados</Link>
                        <Link className="active:text-miau-green transition" href={"/parceiro/solicitacoes"}>Solicitações</Link>
                        <Link className="active:text-miau-green transition" href={"/parceiro/configuracoes"}>Configurações</Link>
                    </nav>
                </>
            )
        case "adotante":
            return (
                <>
                    <nav className="flex flex-col space-y-4 text-text-black text-2xl md:text-[28px]">
                        <Link className="active:text-miau-green transition" href={"/adotante/home"}>Pets cadastrados</Link>
                        <Link className="active:text-miau-green transition" href={"/adotante/solicitacoes"}>Solicitações</Link>
                        <Link className="active:text-miau-green transition" href={"/adotante/favoritos"}>Favoritos</Link>
                        <Link className="active:text-miau-green transition" href={"/adotante/perfil"}>Configurações</Link>
                    </nav>
                </>
            )
    }
}