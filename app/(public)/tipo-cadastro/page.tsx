import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/components/LinkButton";

export default function TipoCadastro() {
  return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-[url('/grafo_fundo.png')] bg-no-repeat bg-cover bg-center">
        <div className="h-full w-full items-center flex flex-col gap-8 lg:gap-20 xl:gap-28">
            <div className="flex flex-col gap-10 lg:gap-16 lg:w-full">
                <div className="absolute -mt-20 lg:-mt-40 xl:-mt-32 lg:px-20">
                    <LinkButton href={"/"} text="Voltar" color="white" back={true} />
                </div>
                <h1 className="text-text-black font-medium text-[22px] lg:text-3xl xl:text-4xl text-center">
                    Selecione o tipo de cadastro</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 xl:gap-28">
                <Link href={"/cadastro-parceiro"} className="w-fit h-fit px-12 lg:px-16 xl:px-20 py-10 flex flex-col gap-4 
                    lg:gap-6 xl:gap-8 min-w-60 items-center text-center justify-center bg-white 
                    rounded-4xl lg:rounded-[50px] xl:rounded-[60px] shadow-[3px_3px_4px_2px_rgba(0,0,0,0.25)] 
                    text-text-light-gray">
                    <div className="relative w-16 lg:w-24 xl:w-32 h-20 lg:h-30 xl:h-40">
                        <Image src="/tipo_parceiro.png" alt="Cadastro de parceiro" fill/>
                    </div>
                    <h2 className="font-semibold text-xl lg:text-2xl xl:text-3xl">ONG / Protetor</h2>
                    <p className="font-semibold text-xl lg:text-2xl xl:text-3xl">(Quero divulgar!)</p>
                </Link> 

                <Link href={"/cadastro-adotante"} className="w-fit h-fit px-12 lg:px-16 xl:px-20 py-10 flex flex-col gap-4 
                    lg:gap-6 xl:gap-8 min-w-60 items-center text-center justify-center bg-white 
                    rounded-4xl lg:rounded-[50px] xl:rounded-[60px] shadow-[3px_3px_4px_2px_rgba(0,0,0,0.25)] 
                    text-text-light-gray">
                    <div className="relative w-19 lg:w-28 xl:w-36 h-20 lg:h-30 xl:h-40">
                        <Image src="/tipo_adotante.png" alt="Cadastro de adotante" fill/>
                    </div>
                    <h2 className="font-semibold text-xl lg:text-2xl xl:text-3xl">Adotante</h2>
                    <p className="font-semibold text-xl lg:text-2xl xl:text-3xl">(Quero adotar!)</p>
                </Link>
            </div>
        </div>
        
    </div>
  );
}