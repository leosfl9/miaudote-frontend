import Image from "next/image";
import Link from "next/link";

export default function RequestCard () {
    return (
        <div className="bg-white flex flex-col items-center gap-5 sm:gap-8 py-4 px-6 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center sm:items-start sm:self-start">
                <div className="relative w-24 h-24">
                    <Image src={"/Bolt.jpeg"} alt="Imagem do pet" className="rounded-full object-cover" fill />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col text-center sm:text-start">
                        <h1 className="text-xl font-medium text-text-light-gray">Bolt</h1>
                        <h2 className="text-text-gray text-sm">Adotante: <span>Leonardo Flores</span></h2>
                    </div>
                    <div className="bg-hr rounded-md px-4 py-2 w-fit self-start">
                        <p className="text-sm text-text-light-gray font-bold">Pendente</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 sm:items-center text-center">
                <h2 className="text-text-gray text-sm">Solicitado em: <span>10/11/2025</span></h2>
                <Link href={"/parceiro/solicitacoes"} className={`px-4 py-2 rounded-4xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition w-full sm:w-fit
                bg-miau-orange text-background hover:bg-miau-green active:bg-miau-light-green font-bold`}>
                    Ver detalhes
                </Link>
            </div>
        </div>
    );
}