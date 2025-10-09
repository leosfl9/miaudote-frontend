"use client"

import LinkButton from "@/components/LinkButton";
import AnimalPresentation from "@/components/AnimalPresentation";

import { X } from "lucide-react";

import { useState, useEffect } from "react";

export default function DetalhesSolicitacao() {
    const [openCancela, setOpenCancela] = useState(false);

    useEffect(() => {
        if (openCancela) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openCancela]);

    return (
        <div className="flex flex-col gap-6 lxl:relative sm:gap-8 items-center justify-center px-2 md:px-8 py-8 lxl:py-10 
            bg-[url('/grafo_pets.png')] bg-no-repeat bg-cover bg-center flex-1">
            
            <div className="w-full lxl:absolute lxl:top-10 lxl:pl-10">
                <LinkButton href={"/adotante/solicitacoes"} text="Voltar" color="white" back={true} />
            </div>

            <AnimalPresentation tipo="solicitacao" href="#" onOpenModalCancela={() => setOpenCancela(true)} />

            {openCancela && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setOpenCancela(false)}>
                    <div className="relative bg-white rounded-lg px-4 ssm:px-6 pt-12 ssm:pt-14 pb-4 sm:pb-6 flex flex-col items-center gap-4 
                        max-h-[90vh] max-w-[280px] ssm:max-w-[320px] sm:max-w-[340px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-4 right-4">
                            <X className="text-text-gray w-6 sssm:w-8 h-6 sssm:h-8 cursor-pointer hover:text-miau-green active:text-miau-green" 
                                onClick={() => setOpenCancela(false)} />
                        </div>
                        <h1 className="text-text-light-gray font-bold text-3xl ssm:text-4xl text-center mb-2 tracking-wide">
                            Tem certeza?
                        </h1>
                        <div className="flex flex-col gap-4 xl:gap-6 text-center">
                            <h2 className="text-text-gray text-xl ssm:text-2xl">Deseja mesmo cancelar a solicitação de adoção?</h2>

                            <button className={`w-fit self-center text-lg ssm:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                                shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-miau-purple hover:bg-miau-light-green active:bg-miau-light-green`}>
                                Confirmar <span className="hidden sm:inline">cancelamento</span> 
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}