"use client"

import Link from "next/link";
import { useState } from "react";

interface PresentationProps {
    tipo: string;
    onOpenModal?: () => void;
    onOpenModalCancela?: () => void;
    href: string;
    nome: string;
    especie: string;
    descricao?: string;
    idade: number;
    obs?: string;
    sexo: string;
    porte: string;
    estado: string;
    cidade: string;
    fotos: string[];
}

export default function AnimalPresentation ({
    tipo, onOpenModal, onOpenModalCancela, href, nome, descricao, idade, obs, porte, sexo, estado, cidade, fotos: fotosIniciais, especie}: PresentationProps) {
    let texto = ""

    if (tipo == "adotante") 
        texto = "Quero adotar!"
    else if (tipo == "parceiro")
        texto = "Editar informações"
    else texto = "Whatsapp parceiro"

    const [fotos, setFotos] = useState(fotosIniciais);

    const trocarPrincipal = (index: number) => {
        if (index === 0) return;
        
        const novasFotos = [...fotos];
        const temp = novasFotos[0];
        novasFotos[0] = novasFotos[index];
        novasFotos[index] = temp;
        setFotos(novasFotos);
    };

    return (
        <div className={`${especie == "Gato" ? "bg-miau-purple" : "bg-miau-orange"} py-6 ssm:py-8 2xl:py-10 px-6 sm:px-12 md:px-20 lg:pr-4 rounded-4xl flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 
            w-full max-w-[1480px] items-center`}>
            <div className="flex flex-col gap-2 w-full lg:order-2 items-center lg:w-[30vw]">
                {fotos.length > 0 ? (
                    <img
                    alt={`Foto principal do ${nome}`}
                    src={`data:image/jpeg;base64,${fotos[0]}`}
                    className="object-cover object-center rounded-2xl shrink-0 w-full max-w-[380px] h-64 ssm:h-80 xl:h-96"
                    />
                ) : (
                    <div className="w-full max-w-[380px] h-64 ssm:h-80 xl:h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                        Sem foto
                    </div>
                )}

                <div className="flex flex-row justify-center gap-2">
                    {fotos.slice(1, 5).map((foto, i) => (
                        <img
                        key={i}
                        src={`data:image/jpeg;base64,${foto}`}
                        alt={`Foto ${i + 2} de ${nome}`}
                        onClick={() => trocarPrincipal(i + 1)}
                        className={`rounded-lg w-20 h-20 object-cover cursor-pointer ${
                            i === 3 ? "hidden ssm:inline lg:hidden lxl:!inline" : ""
                        }`}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col text-white gap-5 ssm:gap-7 md:gap-8 xl:gap-10 w-full lg:min-w-0 lg:max-w-none lg:w-[70vw]">
                <h1 className="font-bold text-4xl md:text-5xl xl:text-6xl text-center truncate" title={nome}>{nome}</h1>
                {tipo == "solicitacao" && (
                    <p className="text-base text-background font-medium text-center -mt-6">Solicitado em: <span>10/02/2025</span></p>
                )}
                <p className="text-xl md:text-2xl xl:text-3xl text-justify line-clamp-7 sm:line-clamp-4 lg:h-[128px] xl:h-fit" 
                    title={descricao ? descricao : "Nenhuma descrição adicionada"}>
                    {descricao ? descricao : "Nenhuma descrição adicionada."}
                </p>
                <div id="teste" className="flex flex-col sm:flex-row sm:justify-between w-full gap-5 ssm:gap-7 sm:gap-8">
                    <div className="flex flex-col gap-1 text-xl md:text-2xl xl:text-3xl w-full text-left sm:max-w-[35%] self-start">
                        <h3 className="font-semibold">Idade: <span className="font-normal">{idade}</span > <span className="font-normal">ano</span><span className="font-normal">{(idade > 1) ? "s" : ""}</span></h3>
                        <h3 className="font-semibold">Sexo: <span className="font-normal">{sexo}</span></h3>
                        <h3 className="font-semibold">Porte: <span className="font-normal">{porte}</span></h3>
                        <h3 className="font-semibold">Estado: <span className="font-normal">{estado}</span></h3>
                        <h3 title={cidade} className="truncate font-semibold">Cidade: <span className="font-normal">{cidade}</span></h3>
                    </div>

                    <div className="flex flex-col gap-5 ssm:gap-7 sm:w-[65%]">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl md:text-2xl xl:text-3xl font-semibold">Observações importantes:</h2>
                            <p className="text-xl md:text-2xl xl:text-3xl overflow-hidden text-ellipsis line-clamp-2 max-w-[400px] xl:max-w-none" 
                                title={obs ? obs : "Nenhuma observação adicionada"}>{obs ? obs : "Nenhuma observação adicionada."}</p>
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