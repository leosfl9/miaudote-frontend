"use client"

import { Divide } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PresentationProps {
    tipo: string;
    onOpenModal?: () => void;
    onOpenModalCancela?: () => void;
    href: string;
}

export default function AnimalPresentation ({tipo, onOpenModal, onOpenModalCancela, href}: PresentationProps) {
    let texto = ""

    if (tipo == "adotante") 
        texto = "Quero adotar!"
    else if (tipo == "parceiro")
        texto = "Editar informações"
    else texto = "Whatsapp parceiro"

    return (
        <div className="bg-miau-orange py-6 ssm:py-8 2xl:py-10 px-6 sm:px-12 md:px-20 lg:pr-4 rounded-4xl flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 
            w-full max-w-[1480px] items-center">
            <div className="flex flex-col gap-2 w-full lg:order-2 items-center">
                <img alt="Imagem do animal" src={"/Bolt.jpeg"} className="object-cover object-center rounded-2xl shrink-0 w-full max-w-[380px] h-64 ssm:h-80 xl:h-96"/>
                <div className="grid grid-cols-3 sssm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1 2xl:gap-2">
                    <img src={"/Céu.jpeg"} alt="" className="rounded-lg w-20 h-20 object-cover" />
                    <img src={"/Céu.jpeg"} alt="" className="rounded-lg w-20 h-20 object-cover" />
                    <img src={"/Céu.jpeg"} alt="" className="rounded-lg w-20 h-20 object-cover" />
                    <img src={"/Céu.jpeg"} alt="" className="hidden sssm:inline lg:hidden xl:inline rounded-lg w-20 h-20 object-cover" />
                </div>
            </div>
            <div className="flex flex-col text-white gap-5 ssm:gap-7 md:gap-8 xl:gap-10 max-w-full lg:min-w-0 lg:max-w-none">
                <h1 className="font-bold text-4xl md:text-5xl xl:text-6xl text-center truncate">Bolt</h1>
                {tipo == "solicitacao" && (
                    <p className="text-base text-background font-medium text-center -mt-6">Solicitado em: <span>10/02/2025</span></p>
                )}
                <p className="text-xl md:text-2xl xl:text-3xl text-justify sm:line-clamp-5">
                    Pipoca passou sua infância em um abrigo e após adoção conjunta com seu irmãozinho foi deixado no abrigo PetFriends. Muito brincalhão e dócil.
                    Espera uma família que possa chamar de sua, pronto para brincar e ser leal a você!
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between  gap-5 ssm:gap-7 sm:gap-8">
                    <div className="flex flex-col gap-1 text-xl md:text-2xl xl:text-3xl sm:max-w-[40%]">
                        <h3>Idade: <span>8 anos</span></h3>
                        <h3>Sexo: <span>Macho</span></h3>
                        <h3>Porte: <span>Grande</span></h3>
                        <h3>Estado: <span>São Paulo</span></h3>
                        <h3 title={"São José do Vale do Rio Preto"} className="truncate">Cidade: <span>São José do Vale do Rio Preto</span></h3>
                    </div>

                    <div className="flex flex-col gap-5 ssm:gap-7 sm:w-[60%]">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl md:text-2xl xl:text-3xl font-semibold">Observações importantes:</h2>
                            <p className="text-xl md:text-2xl xl:text-3xl overflow-hidden text-ellipsis line-clamp-1 max-w-[400px] xl:max-w-[480px]">Bolt está chapado Bolt está chapado Bolt está chapado</p>
                        </div>
                        <div className="flex flex-col xsm:flex-row sm:flex-col xl:flex-row gap-3">
                            <Link href={href} className={`w-full sssm:w-[234px] xsm:w-fit sm:w-[234px] xl:w-fit text-center px-6 py-3 rounded-4xl text-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition 
                                bg-miau-green text-background hover:bg-miau-light-green active:bg-miau-light-green font-bold`}
                                onClick={(e) => {
                                    if (tipo == "adotante" || tipo == "solicitacao"){
                                        e.preventDefault();
                                        onOpenModal?.();
                                    }
                                }}>

                                {texto}
                            </Link>
                            
                            {tipo == "solicitacao" && (
                                <button className="w-full sssm:w-[234px] xsm:w-fit sm:w-[234px] xl:w-fit text-center px-6 py-3 rounded-4xl text-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition 
                                bg-[#F35D5D] hover:bg-[#fA7C7C] active:bg-[#fA7C7C] text-background font-bold cursor-pointer" 
                                    onClick={(e) => {onOpenModalCancela?.(); }}>
                                    Cancelar solicitação
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}