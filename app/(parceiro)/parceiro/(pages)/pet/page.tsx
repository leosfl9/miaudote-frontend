import LinkButton from "@/components/LinkButton";
import AnimalPresentation from "@/components/AnimalPresentation";

export default function PetDetails() {
    return (
        <div className="flex flex-col gap-6 lxl:relative sm:gap-8 items-center justify-center px-2 md:px-8 py-8 lxl:py-10 
            bg-[url('/grafo_pets.png')] bg-no-repeat bg-cover bg-center flex-1">

            <div className="w-full lxl:absolute lxl:top-10 lxl:pl-10">
                <LinkButton href={"/parceiro/home"} text="Voltar" color="white" back={true} />
            </div>

            <AnimalPresentation tipo="parceiro" href="/parceiro/pet" />
            
            
        </div>
    );
}