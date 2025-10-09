import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import SelectField from "@/components/SelectField";

export default function homeAdotante(){
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Meus favoritos</h1>
                <h2 className="text-base 2xl:text-lg">Visualize  seus favoritos, toda beleza do mundo em um só lugar!</h2>
            </div>

            <div className="flex flex-col plg:flex-row plg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                <AnimalCard tipo="adotante" favorito />
                <AnimalCard tipo="adotante" favorito />
                <AnimalCard tipo="adotante" favorito />
                <AnimalCard tipo="adotante" favorito />
                <AnimalCard tipo="adotante" favorito />

            </div>
        </div>
    );
}