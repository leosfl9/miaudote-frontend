import { CirclePlus } from "lucide-react";
import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";

export default function homeParceiro(){
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Pets cadastrados</h1>
                <h2 className="text-base 2xl:text-lg">Cadastre novos pets e verifique os já cadastrados para adoção.</h2>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                <Link href={"/parceiro/cadastro-pet"} className="bg-[#C09BD84D] hover:bg-miau-purple active:bg-miau-purple/80 
                    text-text-gray hover:text-background active:text-background flex gap-2 items-center px-4 py-2 rounded-xl w-full max-w-[380px]
                    lg:h-[512px] lg:flex-col lg:items-center lg:justify-center lg:gap-6">
                    <CirclePlus className="w-8 lg:w-24 h-8 lg:h-24" />
                    <h3 className="font-semibold text-lg lg:text-2xl">Adicionar novo pet</h3>
                </Link>

                <AnimalCard />
                <AnimalCard />
                <AnimalCard />

            </div>
        </div>
    );
}