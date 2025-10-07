import Image from "next/image";
import { CalendarDays, Ruler, Heart } from "lucide-react";
import Link from "next/link";

interface CardProps {
    tipo: string;
}

export default function AnimalCard({tipo}: CardProps){
    return(
        <div className="flex flex-col max-w-[380px] bg-white rounded-xl">
            <div className="relative w-full min-h-64">
                <Image alt="Imagem do animal" src={"/Bolt.jpeg"} className="rounded-t-xl object-cover object-center" fill/>
            </div>

            <div className="flex flex-col gap-8 px-5 py-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <h4 className="text-text-light-gray text-2xl font-bold overflow-clip text-ellipsis">Bolt</h4>
                        { tipo == "adotante" && (
                            <h5 className="text-[#7B7B7B] text-sm font-medium overflow-clip text-ellipsis">ONG Amigos dos Animais</h5>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[#7B7B7B] items-center">
                        <div className="flex gap-[6px] items-center">
                            <Image alt="Ícone de cachorro" src={"/icon_cao.png"} width={20} height={20} />
                            <p className="text-sm font-medium">Cão</p>
                        </div>

                        <div className="flex gap-[6px] items-center">
                            <CalendarDays className="w-5 h-5" />
                            <p className="text-sm font-medium">6 anos</p>
                        </div>

                        <div className="flex gap-[6px] items-center">
                            <Ruler className="w-5 h-5" />
                            <p className="text-sm font-medium">Pequeno</p>
                        </div>
                    </div>
                    <p className="text-sm text-[#7B7B7B] text-justify line-clamp-3">
                        Thor é um cachorro muito brincalhão e cheio de energia. Adora passeios e se dá bem com crianças e outros animais. 
                    </p>
                </div>

                <div className="flex flex-row justify-between items-center">
                    {tipo == "adotante" && (
                        <div className="flex flex-row gap-2 text-[#7B7B7B] hover:text-[#F35D5D] cursor-pointer">
                            <Heart className="" />
                            <p className="font-semibold">Favoritar</p>
                        </div>
                    )}
                    <Link href={`${tipo == "adotante" ? "/adotante/pet" : "/parceiro/pet"}`} className={`px-4 py-2 rounded-4xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition w-fit 
                        bg-miau-orange text-background hover:bg-miau-green active:bg-miau-light-green font-bold`}>
                        Visualizar
                    </Link>
                </div>
            </div>
        </div>
    );
}