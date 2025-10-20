import Image from "next/image";
import { CalendarDays, Ruler, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CardProps {
    tipo: string;
    favorito?: boolean;
    favoritoId?: number | null;
    nome: string,
    especie: string,
    idade: string,
    porte: string,
    descricao?: string,
    sexo?: string,
    foto: string,
    status?: string
    href?: string;
    idPet: number;
    idSolicitacao?: number;
    parceiro?: string;
    estado?: string;
    onToggleFavorito?: (idPet: number, favorito: boolean, favoritoId: number | null) => void;
}

export default function AnimalCard({
    tipo, favorito, nome, especie, idade, porte, descricao, foto, status, idPet, parceiro, onToggleFavorito, favoritoId, idSolicitacao}: CardProps){
    const [isFavorito, setIsFavorito] = useState(!!favorito);
    const [sending, setSending] = useState(false);
    
    const href = tipo === "solicitacao" ? `/adotante/detalhes-solicitacao/${idSolicitacao}` : `/${tipo}/pet/${idPet}`;

    const handleClick = () => {
        setSending(true);
        onToggleFavorito?.(idPet, isFavorito, favoritoId ?? null);
        setIsFavorito(!isFavorito);
    };
    
    return(
        <div className="flex flex-col w-full max-w-[380px] bg-white rounded-xl">
            <div className="relative h-64 w-full">
                <Image alt="Imagem do animal" src={foto} className="rounded-t-xl object-cover object-center" fill/>
            </div>

            <div className="flex flex-col gap-8 px-5 py-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sssm:flex-row sssm:justify-between gap-3 sssm:gap-0 sssm:items-start">
                        <div className="min-w-0">
                            <h4 className={`text-text-light-gray text-2xl font-bold truncate max-w-[16ch] 
                                ${(tipo == "solicitacao") ? "sssm:max-w-[200px] ssm:max-w-[248px]" : ""}
                                ${(tipo == "parceiro") ? "sssm:max-w-[20ch] ssm:max-w-none" : ""}
                                ${(tipo == "adotante") ? "sssm:max-w-[20ch] ssm:max-w-none" : ""}`}
                                title={nome}>
                                {nome}</h4>
                            { (tipo == "adotante" || tipo == "solicitacao") && (
                                <h5 className="text-[#7B7B7B] text-sm font-medium overflow-clip text-ellipsis line-clamp-1">{parceiro}</h5>
                            )}
                        </div>
                        {tipo == "solicitacao" && (
                            <div className={`px-3 py-1 rounded-2xl w-fit mb-2
                                ${status == "Em Aberto" ? "bg-miau-green text-background" : "bg-hr text-text-light-gray"}`}>
                                <p className="text-sm font-medium">
                                    {status}
                                </p>
                            </div>
                        )}

                    </div>
                    <div className="flex flex-wrap gap-4 text-[#7B7B7B] items-center">
                        <div className="flex gap-[6px] items-center">
                            {especie == "Cachorro" ? 
                                <Image alt="Ícone de cachorro" src={"/icon_cao.png"} width={20} height={20} /> 
                                : <Image alt="Ícone de gato" src={"/icon_gato.png"} width={20} height={19} />}
                            
                            <p className="text-sm font-medium">{especie}</p>
                        </div>

                        <div className="flex gap-[6px] items-center">
                            <CalendarDays className="w-5 h-5" />
                            <p className="text-sm font-medium"><span>{idade}</span> ano<span>{parseInt(idade) > 1 ? "s" : ""}</span></p>
                        </div>

                        <div className="flex gap-[6px] items-center">
                            <Ruler className="w-5 h-5" />
                            <p className="text-sm font-medium">{porte}</p>
                        </div>
                    </div>
                    <p title={descricao} className="text-sm text-[#7B7B7B] text-justify line-clamp-3 h-[60px]">
                        {descricao == "" ? "Nenhuma descrição adicionada." : descricao} 
                    </p>
                </div>

                <div className="flex flex-row justify-between items-center">
                    {(tipo == "adotante") && (
                        <button onClick={handleClick} 
                            className={`flex flex-row gap-2 ${favorito == true ? "text-[#F35D5D]" : "text-[#7B7B7B] hover:text-[#F35D5D]"} cursor-pointer`}
                            disabled={sending}>
                            <Heart className={`${favorito == true ? "fill-[#F35D5D]" : ""}`} />
                            <p className={`font-semibold`}>{favorito == true ? "Favorito" : "Favoritar"}</p>
                        </button>
                    )}
                    <Link href={href} className={`px-4 py-2 rounded-4xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition w-fit 
                        ${(tipo == "solicitacao" || especie == "Gato") ? "bg-miau-purple" : "bg-miau-orange"} text-background 
                        hover:bg-miau-green active:bg-miau-light-green font-bold`}>
                        Visualizar
                    </Link>

                    {tipo == "parceiro" && (
                        <p className={`text-sm font-medium 
                            ${status == "Disponível" ? "text-miau-green" : ""}
                            ${status == "Indisponível" ? "text-text-gray" : ""}
                            ${status == "Adotado" ? "text-miau-purple" : ""}`}>
                            Status: <span>{status}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}