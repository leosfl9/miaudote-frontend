import Link from "next/link"
import LinkButton from "../LinkButton"

// tipagem da prop dos links para mobile
interface LinksProps {
    tipo?: string;
}

export default function MobileLinks({tipo}: LinksProps){
    switch (tipo) {
        // links da sidebar pública
        case undefined:
            return (
                <>
                    <nav className="flex flex-col space-y-4 text-text-black text-2xl md:text-[28px]">
                        <Link className="active:text-miau-green transition" href={"/"}>Home</Link>
                        <Link className="active:text-miau-green transition" href={"/"}>Sobre</Link>
                        <Link className="active:text-miau-green transition" href={"/"}>ONGs</Link>
                    </nav>

                    <LinkButton href={"/login"} text={"Login"} center={true} bottom={true} color={"green"} />
                </>
            )
        // links da sidebar do parceiro
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
        // links da sidebar do adotante
        case "adotante":
            return (
                <>
                    <nav className="flex flex-col space-y-4 text-text-black text-2xl md:text-[28px]">
                        <Link className="active:text-miau-green transition" href={"/adotante/home"}>Home</Link>
                        <Link className="active:text-miau-green transition" href={"/adotante/solicitacoes"}>Solicitações</Link>
                        <Link className="active:text-miau-green transition" href={"/adotante/favoritos"}>Favoritos</Link>
                        <Link className="active:text-miau-green transition" href={"/adotante/perfil"}>Perfil</Link>
                    </nav>
                </>
            )
    }
}