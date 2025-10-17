import Image from "next/image";
import Link from "next/link";

interface RequestProps {
    nome: string;
    adotante: string;
    data?: string;
    status: string;
    foto: string;
}

export default function RequestCard ({nome, adotante, data, status, foto}: RequestProps) {
    return (
        <div className="bg-white flex flex-col items-center gap-5 sm:gap-8 py-4 px-6 rounded-xl min-w-[220px]">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center sm:items-start sm:self-start">
                <img src={foto} alt="Imagem do pet" className="rounded-full object-cover w-24 h-24" />
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col text-center sm:text-start">
                        <h1 className="text-xl font-semibold text-text-light-gray truncate overflow-hidden whitespace-nowrap max-w-[170px] sm:max-w-[206px]">{nome}</h1>
                        <h2 className="text-text-gray text-sm truncate overflow-hidden whitespace-nowrap max-w-[170px] sm:max-w-[206px]">Adotante: <span>{adotante}</span></h2>
                    </div>
                    <div className="bg-hr rounded-md px-4 py-2 w-fit self-center sm:self-start">
                        <p className="text-sm text-text-light-gray font-bold">{status}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 sm:items-center text-center pb-1">
                <h2 className="text-text-gray text-sm">Solicitado em: <span>11/02/2025</span></h2>
                <Link href={"/parceiro/detalhes-solicitacao"} className={`px-4 py-2 rounded-4xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition w-full sm:w-fit
                bg-miau-orange text-background hover:bg-miau-green active:bg-miau-light-green font-bold`}>
                    Ver detalhes
                </Link>
            </div>
        </div>
    );
}