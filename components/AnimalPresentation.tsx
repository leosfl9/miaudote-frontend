"use client"

import Image from "next/image";
import Link from "next/link";

interface PresentationProps {
    tipo: string;
    onOpenModal?: () => void;
    href: string;
}

export default function AnimalPresentation ({tipo, onOpenModal, href}: PresentationProps) {
    return (
        <div className="bg-miau-orange py-6 ssm:py-8 px-6 sm:px-12 md:px-20 lg:pr-4 rounded-4xl flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-16 
            w-full max-w-7xl items-center">
            <div className="relative w-full max-w-[380px] min-h-64 ssm:h-80 xl:h-96 lg:order-2">
                <Image alt="Imagem do animal" src={"/Bolt.jpeg"} className="object-cover object-center rounded-full ssm:rounded-4xl" fill/>
            </div>
            <div className="flex flex-col text-white gap-5 ssm:gap-7 md:gap-8 xl:gap-10">
                <h1 className="font-bold text-4xl md:text-5xl xl:text-6xl text-center">Bolt</h1>
                <p className="text-xl md:text-2xl xl:text-3xl text-justify sm:line-clamp-5">
                    Pipoca passou sua infância em um abrigo e após adoção conjunta com seu irmãozinho foi deixado no abrigo PetFriends. Muito brincalhão e dócil.
                    Espera uma família que possa chamar de sua, pronto para brincar e ser leal a você!
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-5 ssm:gap-7">
                    <div className="flex flex-col gap-1 text-xl md:text-2xl xl:text-3xl">
                        <h3 className="">Idade: <span>8 anos</span></h3>
                        <h3 className="">Sexo: <span>Macho</span></h3>
                        <h3 className="">Porte: <span>Grande</span></h3>
                        <h3 className="">Local: <span>São Paulo</span></h3>
                    </div>

                    <div className="flex flex-col gap-5 ssm:gap-7">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl md:text-2xl xl:text-3xl font-semibold">Observações importantes:</h2>
                            <p className="text-xl md:text-2xl xl:text-3xl">Bolt está chapado</p>
                        </div>
                        <Link href={href} className={`px-6 py-3 rounded-4xl text-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition w-fit 
                            bg-miau-green text-background hover:bg-miau-light-green active:bg-miau-light-green font-bold`}
                            onClick={(e) => {
                                if (tipo == "adotante"){
                                    e.preventDefault();
                                    onOpenModal?.();
                                }
                            }}>

                            {tipo == "adotante" ? "Quero adotar!" : "Editar informações"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}